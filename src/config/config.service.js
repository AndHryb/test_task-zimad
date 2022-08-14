export default class ConfigService {
  constructor(config) {
    this.config = config;
  }

  get(pathToConfig) {
    return this.parsePath(this.config, pathToConfig);
  }

  parsePath(config, pathToConfig) {
    const pathElements = Array.isArray(pathToConfig) ? pathToConfig : pathToConfig.split('.');
    const name = pathElements[0];
    const value = config[name];
    if (pathElements.length <= 1) {
      return value;
    }
    if (value === null || typeof value !== 'object') {
      return undefined;
    }
    return this.parsePath(value, pathElements.slice(1));
  }
}
