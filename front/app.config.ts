module.exports = {
  "name": "Chromacase",
  "slug": "Chromacase",
  "version": "1.0.0",
  "orientation": "portrait",
  "icon": "./assets/icon.png",
  "userInterfaceStyle": "light",
  "splash": {
    "image": "./assets/splashLogo.png",
    "resizeMode": "contain",
    "backgroundColor": "#ffffff"
  },
  "updates": {
    "fallbackToCacheTimeout": 0
  },
  "assetBundlePatterns": [
    "**/*"
  ],
  "ios": {
    "supportsTablet": true
  },
  "android": {
    "adaptiveIcon": {
      "foregroundImage": "./assets/adaptive-icon.png",
      "backgroundColor": "#FFFFFF",
      "package": "com.chromacase.chromacase",
      "versionCode": 1
    },
    "package": "build.apk"
  },
  "web": {
    "favicon": "./assets/favicon.png"
  },
  "extra": {
    apiUrl: process.env.API_URL,
    scoroUrl: process.env.SCORO_URL,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    "eas": {
      "projectId": "dade8e5e-3e2c-49f7-98c5-cf8834c7ebb2"
    }
  }
}
