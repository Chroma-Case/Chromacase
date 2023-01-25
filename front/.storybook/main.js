module.exports = {
	stories: ["../**/*.stories.mdx", "../**/*.stories.@(js|jsx|ts|tsx)"],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@storybook/addon-interactions",
	],
	framework: "@storybook/react",

	webpack: (config) => {
		config.resolve = {
			...config.resolve,
			alias: {
				...config.resolve.alias,
				"react-native$": "react-native-web",
			},
			extensions: [
				".web.ts",
				".web.tsx",
				".web.js",
				".web.jsx",
				...config.resolve.extensions,
			],
		};
		return config;
	},
};
