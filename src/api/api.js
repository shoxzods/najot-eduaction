import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://najot-edu.softwareengineer.uz/api/v1',
  timeout: 1000,
})