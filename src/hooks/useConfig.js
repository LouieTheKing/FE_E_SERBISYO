import { useState, useEffect } from 'react';
import configService from '../utils/configService';

export const useConfig = (configName, defaultValue = null) => {
  const [configValue, setConfigValue] = useState(
    configService.getConfigValue(configName, defaultValue)
  );

  useEffect(() => {
    const updateConfig = () => {
      const value = configService.getConfigValue(configName, defaultValue);
      setConfigValue(value);
    };

    // Initial load
    updateConfig();

    // Set up interval to check for config updates
    const interval = setInterval(() => {
      if (configService.isCacheExpired()) {
        updateConfig();
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [configName, defaultValue]);

  return configValue;
};

export const useAllConfigs = () => {
  const [configs, setConfigs] = useState(configService.getCachedConfigurations());

  useEffect(() => {
    const updateConfigs = () => {
      const allConfigs = configService.getCachedConfigurations();
      setConfigs(allConfigs);
    };

    // Initial load
    updateConfigs();

    // Set up interval to check for config updates
    const interval = setInterval(() => {
      if (configService.isCacheExpired()) {
        updateConfigs();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return configs;
};