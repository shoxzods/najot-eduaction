export type ToastType = 'success' | 'error' | 'info' | 'warning';

export type ToastOptions = {
    message: string;
    type?: ToastType;
};

class ToastManager {
    private listener: ((options: ToastOptions) => void) | null = null;

    subscribe(listener: (options: ToastOptions) => void) {
        this.listener = listener;
    }

    show(message: string, type: ToastType = 'info') {
        if (this.listener) {
            this.listener({ message, type });
        } else {
            alert(message);
        }
    }
}

export const toastManager = new ToastManager();

export const toast = {
    success: (message: string) => toastManager.show(message, 'success'),
    error: (message: string) => toastManager.show(message, 'error'),
    info: (message: string) => toastManager.show(message, 'info'),
    warning: (message: string) => toastManager.show(message, 'warning'),
};
