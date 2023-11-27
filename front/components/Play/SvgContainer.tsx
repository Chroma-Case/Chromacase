import React from 'react';
import { ViewStyle, ImageBackground, Platform, Image } from 'react-native';
import { SvgCssUri } from 'react-native-svg/css';

type SvgContainerProps = {
	url: string;
	onReady?: () => void;
	style?: ViewStyle;
};

export const GetSvgDims = (url: string, success: (w: number, h: number) => void) => {
	if (Platform.OS === 'web') {
		React.useEffect(() => {
			Image.getSize(url, (w, h) => {
				success(w, h);
			});
		}, [url]);
		return;
	}
	// success(470.1052279999999, 275);
	success(6146.845969199998, 408.00000000000006);
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
