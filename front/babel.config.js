module.exports = function (api) {
	api.cache(true);
	return {
		presets: ['babel-preset-expo'],
		plugins: [
			[
				'module:react-native-dotenv',
				{
					moduleName: '@env',
					path: '.env',
					blacklist: null,
					whitelist: null,
					safe: false,
					allowUndefined: true,
				},
			],
		],
		// plugins: ['@babel/plugin-proposal-export-namespace-from', 'react-native-reanimated/plugin'],
		// env: {
		// 	production: {
		// 		plugins: ['react-native-paper/babel'],
		// 	},
		// },
	};
};
