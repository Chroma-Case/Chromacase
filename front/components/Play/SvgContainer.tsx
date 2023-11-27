import React from 'react';
import { ViewStyle, ImageBackground, Platform } from 'react-native';
import { SvgCssUri } from 'react-native-svg/css';

type SvgContainerProps = {
	url: string;
	onReady?: () => void;
	style?: ViewStyle;
};

export const SvgContainer = ({ url, onReady, style }: SvgContainerProps) => {
	if (Platform.OS === 'web') {
		return <ImageBackground source={{ uri: url }} onLoad={onReady} style={style} />;
	}
	return (
		<SvgCssUri
			uri={url}
			style={style}
			// force to not look at the width and height of the actual file
			height={undefined}
			width={undefined}
			onLoad={onReady}
		/>
	);
};
