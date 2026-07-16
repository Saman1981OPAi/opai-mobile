const { withEntitlementsPlist } = require("expo/config-plugins");

module.exports = function withOpaiWeatherKit(config) {
  return withEntitlementsPlist(config, (nextConfig) => {
    nextConfig.modResults["com.apple.developer.weatherkit"] = true;
    return nextConfig;
  });
};
