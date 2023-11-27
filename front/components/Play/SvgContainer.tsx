import React from 'react';
import { ViewStyle, ImageBackground, Platform, Image } from 'react-native';
import { SvgCssUri } from 'react-native-svg/css';
import Svg, { Path, Text, G } from 'react-native-svg';

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
	success(470.1052279999999, 275);
};

export const SvgContainer = ({ url, onReady, style }: SvgContainerProps) => {

	if (Platform.OS === 'web') {
		return (
			<ImageBackground
				source={{ uri: url }}
				onLoad={onReady}
				style={[
					{
						// aspectRatio: dims[0] / dims[1],
					},
					style,
				]}
			/>
		);
	}
	return (
		<SvgCssUri
			uri={url}
			style={[
				{
					// aspectRatio: 2545.469353542076 / 193.5,
					// aspectRatio: 470 / 275,
				},
				style,
			]}
			// onLayout={(e) => {
			// 	const { width, height } = e.nativeEvent.layout;
			// 	getDims(width, height);
			// }}
			onLoad={onReady}
		/>
	);
};
