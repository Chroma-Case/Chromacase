import React, { useEffect } from 'react';
import { View, Animated, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import TextFieldBase, { TextFieldBaseProps } from './TextFieldBase';
import { Text } from 'native-base';
import { Warning2 } from 'iconsax-react-native';

interface TextFormFieldProps extends TextFieldBaseProps {
	style?: StyleProp<ViewStyle>;
	error: string | null;
}

const ERROR_HEIGHT = 20;
const ERROR_PADDING_TOP = 8;

const TextFormField: React.FC<TextFormFieldProps> = ({ error, style, ...textFieldBaseProps }) => {
	const fadeAnim = React.useRef(new Animated.Value(0)).current;
	const heightAnim = React.useRef(new Animated.Value(0)).current;
	const paddingTopAnim = React.useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: error ? 1 : 0,
				duration: 150,
				useNativeDriver: false,
			}),
			Animated.timing(heightAnim, {
				toValue: error ? ERROR_HEIGHT : 0,
				duration: 250,
				useNativeDriver: false,
			}),
			Animated.timing(paddingTopAnim, {
				toValue: error ? ERROR_PADDING_TOP : 0,
				duration: 250,
				useNativeDriver: false,
			}),
		]).start();
	}, [error]);

	return (
		<View style={[styles.wrapper, style]}>
			<TextFieldBase iconColor={error ? '#f7253d' : undefined} {...textFieldBaseProps} />
			<Animated.View
				style={{
					...styles.errorContainer,
					opacity: fadeAnim,
					height: heightAnim,
					paddingTop: paddingTopAnim,
				}}
			>
				<Warning2 size="16" color="#f7253d" variant="Bold" />
				<Text isTruncated maxW={'100%'} style={styles.errorText}>
					{error}
				</Text>
			</Animated.View>
		</View>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		width: '100%',
		// maxWidth: 400,
	},
	errorContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: 12,
	},
	errorText: {
		color: '#f7253d',
		fontSize: 12,
		marginLeft: 8,
	},
});

export default TextFormField;
