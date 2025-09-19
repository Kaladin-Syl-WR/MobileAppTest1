module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo(nent)?|@expo(nent)?/.*|expo-app-loading|@expo-app-loading|@unimodules|unimodules|sentry-expo|native-base|react-navigation|@react-navigation)/)'
  ]
};
