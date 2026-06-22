import axios, { InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';

const endpoint = 'https://najot-edu.softwareengineer.uz/api/v1';

export const getFileUrl = (photo: string | null | undefined): string | null => {
  if (!photo) return null;
  if (photo.startsWith('http')) return photo;
  const cleanPhoto = photo.startsWith('/') ? photo.slice(1) : photo;
  return `https://najot-edu.softwareengineer.uz/files/${cleanPhoto}`;
};

let profilePromise: Promise<any> | null = null;

export const fetchMyProfile = (forceRefresh = false) => {
  if (profilePromise && !forceRefresh) return profilePromise;
  
  const role = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;

  if (role === 'TEACHER') {
    profilePromise = api.get('/teachers/my/profile')
      .then(res => res.data?.data || res.data);
  } else {
    profilePromise = Promise.resolve({ 
      full_name: role === 'STUDENT' ? 'Student' : 'User'
    });
  }

  return profilePromise;
};

export const clearProfileCache = () => {
  profilePromise = null;
};

const groupsPromiseCache: Record<string, Promise<any>> = {};

export const fetchGroupsCached = (endpoint: string, forceRefresh = false) => {
  if (groupsPromiseCache[endpoint] && !forceRefresh) {
    return groupsPromiseCache[endpoint];
  }
  
  groupsPromiseCache[endpoint] = api.get(endpoint)
    .then(res => res.data?.data || res.data)
    .catch(err => {
      delete groupsPromiseCache[endpoint];
      throw err;
    });

  return groupsPromiseCache[endpoint];
};

export const api = axios.create({
  baseURL: endpoint,
  timeout: 10000,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If error is 401 and we haven't retried this request yet, and it's not a login or refresh request
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh-token')
    ) {
      if (isRefreshing) {
        // If another request is already refreshing the token, queue this request
        try {
          const token = await new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        // Try to get a new token
        const { data } = await axios.post(`${endpoint}/auth/refresh-token`, {
          token: refreshToken,
        });

        const newAccessToken = data?.accessToken || data?.data?.accessToken || data?.token;

        if (newAccessToken) {
          // Save the new token
          localStorage.setItem('accessToken', newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);

          // Retry the original request
          return api(originalRequest);
        } else {
          throw new Error("No token returned from refresh endpoint");
        }
      } catch (err) {
        processQueue(err, null);
        // Clear token and redirect to login if refresh fails
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
