module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Reanimated v4 exposes its Babel plugin from react-native-worklets
    plugins: ['react-native-worklets/plugin']
  };
};
