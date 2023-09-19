module.exports = {
	name: 'Chromacase',
	slug: 'Chromacase',
	version: '1.0.0',
	orientation: 'portrait',
	icon: './assets/icon.png',
	userInterfaceStyle: 'light',
	splash: {
		image: './assets/splash.png',
		resizeMode: 'contain',
		backgroundColor: '#ffffff',
	},
	updates: {
		fallbackToCacheTimeout: 0,
	},
	assetBundlePatterns: ['**/*'],
	ios: {
		supportsTablet: true,
	},
	android: {
		package: 'build.apk',
	},
	web: {
		favicon: './assets/favicon.png',
	},
	extra: {
		apiUrl: process.env.API_URL,
		scoroUrl: process.env.SCORO_URL,
		eas: {
			projectId: 'dade8e5e-3e2c-49f7-98c5-cf8834c7ebb2',
		},
	},
};
