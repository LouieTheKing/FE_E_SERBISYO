import axios from '../axios';

const CONFIG_STORAGE_KEY = 'app_configurations';
const CONFIG_TIMESTAMP_KEY = 'app_configurations_timestamp';
const COOLDOWN_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

class ConfigService {
  async getConfigurations() {
    const now = Date.now();
    const lastFetch = localStorage.getItem(CONFIG_TIMESTAMP_KEY);
    const cachedConfigs = localStorage.getItem(CONFIG_STORAGE_KEY);

    // Check if we have cached data and it's still within cooldown period
    if (cachedConfigs && lastFetch) {
      const timeDiff = now - parseInt(lastFetch);
      if (timeDiff < COOLDOWN_DURATION) {
        return JSON.parse(cachedConfigs);
      }
    }

    // Fetch fresh configurations from API
    try {
      const response = await this.fetchConfigurationsFromAPI();
      const configs = response.data;
      
      // Store in localStorage with timestamp
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(configs));
      localStorage.setItem(CONFIG_TIMESTAMP_KEY, now.toString());
      
      return configs;
    } catch (error) {
      console.warn('Failed to fetch configurations, using cached data if available:', error);
      // Return cached data if API fails
      return cachedConfigs ? JSON.parse(cachedConfigs) : [];
    }
  }

  async fetchConfigurationsFromAPI() {
    // Use a direct axios call to avoid circular dependency
    const response = await axios.get('/configs');
    return response.data;
  }

  getConfigValue(name, defaultValue = null) {
    const configs = this.getCachedConfigurations();
    const config = configs.find(c => c.name === name);
    if (config) {
      return config.value;
    }
    return defaultValue !== null ? defaultValue : `${name} not setup yet`;
  }

  getCachedConfigurations() {
    const cachedConfigs = localStorage.getItem(CONFIG_STORAGE_KEY);
    return cachedConfigs ? JSON.parse(cachedConfigs) : [];
  }

  clearCache() {
    localStorage.removeItem(CONFIG_STORAGE_KEY);
    localStorage.removeItem(CONFIG_TIMESTAMP_KEY);
  }

  // Check if cache is expired
  isCacheExpired() {
    const lastFetch = localStorage.getItem(CONFIG_TIMESTAMP_KEY);
    if (!lastFetch) return true;
    
    const now = Date.now();
    const timeDiff = now - parseInt(lastFetch);
    return timeDiff >= COOLDOWN_DURATION;
  }
}

export default new ConfigService();