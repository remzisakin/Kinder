import axios from 'axios';
import Constants from 'expo-constants';
import { API_BASE_URL as ENV_BASE_URL } from '@env';

const manifestBaseUrl =
  Constants.expoConfig?.extra?.apiBaseUrl || Constants.expoConfig?.hostUri || undefined;

const fallback = 'http://10.0.2.2:4000';

const baseURL = ENV_BASE_URL || manifestBaseUrl || fallback;

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
});

export const setAuthHeader = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
};
