import axios from "axios";
import configService from './utils/configService';

// Helper to access loading context outside React tree
let loadingContext = null;
export function setLoadingContext(ctx) {
  loadingContext = ctx;
}

 const BASE_URL = 'http://127.0.0.1:8000/api';
const UNAUTHORIZED = 401;
const EXEMPTED_PATHS = ["/login"];

// Flag to prevent infinite loops when fetching configs
let isFetchingConfigs = false;

const axiosInstance = axios.create({
   baseURL: BASE_URL,
   headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
   },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Fetch configurations on each request (with cooldown)
    // Skip if we're already fetching configs or if it's the config endpoint itself
    if (!isFetchingConfigs && !config.url?.includes('/configs')) {
      try {
        isFetchingConfigs = true;
        await configService.getConfigurations();
      } catch (error) {
        console.warn('Failed to update configurations:', error);
      } finally {
        isFetchingConfigs = false;
      }
    }

    // Use loading context if available
    if (loadingContext && loadingContext.show) loadingContext.show();
    return config;
  },
  (error) => {
    isFetchingConfigs = false;
    if (loadingContext && loadingContext.hide) loadingContext.hide();
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (loadingContext && loadingContext.hide) loadingContext.hide();
    return response;
  },
  (error) => {
    if (loadingContext && loadingContext.hide) loadingContext.hide();
    if (error.response) {
      const currentPath = error.config.url;
      const isExemptedPath = EXEMPTED_PATHS.some((path) => currentPath.includes(path));
      if (error.response.status === UNAUTHORIZED && !isExemptedPath) {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        localStorage.removeItem("userRole");
        // Also clear config cache on logout
        configService.clearCache();
         window.location.href = "/login";
      }
    }
    if (error.code === "ERR_NETWORK") {
      // toast.error("Failed to connect to the server. Please try again later.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
