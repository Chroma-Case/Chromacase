import { Pressable, useTheme } from 'native-base';
import React, { useRef } from 'react';
import { Animated, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface InteractiveBaseProps {
	children?: React.ReactNode;
	onPress?: () => Promise<void>;
	isDisabled?: boolean;
	isOutlined?: boolean;
	focusable?: boolean;
	style?: StyleProp<ViewStyle>;
	styleAnimate: {
		Default: {
			scale: number;
			shadowOpacity: number;
			shadowRadius: number;
			elevation: number;
			backgroundColor: string;
		};
		onHover: {
			scale: number;
			shadowOpacity: number;
			shadowRadius: number;
			elevation: number;
			backgroundColor: string;
		};
		onPressed: {
			scale: number;
			shadowOpacity: number;
			shadowRadius: number;
			elevation: number;
			backgroundColor: string;
		};
		Disabled: {
			scale: number;
			shadowOpacity: number;
			shadowRadius: number;
			elevation: number;
			backgroundColor: string;
		};
	};
}

const InteractiveBase: React.FC<InteractiveBaseProps> = ({
	children,
	onPress,
	style,
	styleAnimate,
	isDisabled = false,
	isOutlined = false,
	focusable = true,
}) => {
	const { colors } = useTheme();
	const scaleAnimator = useRef(new Animated.Value(1)).current;
	const scaleValue = scaleAnimator.interpolate({
		inputRange: [0, 1, 2],
		outputRange: [
			styleAnimate.Default.scale,
			styleAnimate.onHover.scale,
			styleAnimate.onPressed.scale,
		],
	});
	const shadowOpacityAnimator = useRef(new Animated.Value(0)).current;
	const shadowOpacityValue = shadowOpacityAnimator.interpolate({
		inputRange: [0, 1, 2],
		outputRange: [
			styleAnimate.Default.shadowOpacity,
			styleAnimate.onHover.shadowOpacity,
			styleAnimate.onPressed.shadowOpacity,
		],
	});
	const shadowRadiusAnimator = useRef(new Animated.Value(0)).current;
	const shadowRadiusValue = shadowRadiusAnimator.interpolate({
		inputRange: [0, 1, 2],
		outputRange: [
			styleAnimate.Default.shadowRadius,
			styleAnimate.onHover.shadowRadius,
			styleAnimate.onPressed.shadowRadius,
		],
	});
	const elevationAnimator = useRef(new Animated.Value(0)).current;
	const elevationValue = elevationAnimator.interpolate({
		inputRange: [0, 1, 2],
		outputRange: [
			styleAnimate.Default.elevation,
			styleAnimate.onHover.elevation,
			styleAnimate.onPressed.elevation,
		],
	});
	const backgroundColorAnimator = useRef(new Animated.Value(0)).current;
	const backgroundColorValue = backgroundColorAnimator.interpolate({
		inputRange: [0, 1, 2],
		outputRange: [
			styleAnimate.Default.backgroundColor,
			styleAnimate.onHover.backgroundColor,
			styleAnimate.onPressed.backgroundColor,
		],
	});

	// Mouse Enter
	const handleMouseEnter = () => {
		Animated.parallel([
			Animated.spring(scaleAnimator, {
				toValue: 1,
				useNativeDriver: false,
			}),
			Animated.timing(backgroundColorAnimator, {
				toValue: 1,
				duration: 250,
				useNativeDriver: false,
			}),
			Animated.timing(shadowRadiusAnimator, {
				toValue: 1,
				duration: 250,
				useNativeDriver: false,
			}),
			Animated.timing(shadowOpacityAnimator, {
				toValue: 1,
				duration: 250,
				useNativeDriver: false,
			}),
			Animated.timing(elevationAnimator, {
				toValue: 1,
				duration: 250,
				useNativeDriver: false,
			}),
		]).start();
	};
	// Mouse Down
	const handlePressIn = () => {
		Animated.parallel([
			Animated.spring(scaleAnimator, {
				toValue: 2,
				useNativeDriver: false,
			}),
			Animated.timing(backgroundColorAnimator, {
				toValue: 2,
				duration: 250,
				useNativeDriver: false,
			}),
			Animated.timing(shadowRadiusAnimator, {
				toValue: 2,
				duration: 250,
				useNativeDriver: false,
			}),
			Animated.timing(shadowOpacityAnimator, {
				toValue: 2,
				duration: 250,
				useNativeDriver: false,
			}),
			Animated.timing(elevationAnimator, {
				toValue: 2,
				duration: 250,
				useNativeDriver: false,
			}),
		]).start();
	};
	// Mouse Up
	const handlePressOut = () => {
		Animated.parallel([
			Animated.spring(scaleAnimator, {
				toValue: 1,
				useNativeDriver: false,
			}),
			Animated.timing(backgroundColorAnimator, {
				toValue: 1,
				duration: 250,
				useNativeDriver: false,
			}),
			Animated.timing(shadowRadiusAnimator, {
				toValue: 1,
				duration: 250,
				useNativeDriver: false,
			}),
			Animated.timing(shadowOpacityAnimator, {
				toValue: 1,
				duration: 250,
				useNativeDriver: false,
			}),
			Animated.timing(elevationAnimator, {
				toValue: 1,
				duration: 250,
				useNativeDriver: false,
			}),
		]).start();

		if (onPress && !isDisabled) {
			onPress();
		}
	};
	// Mouse Leave
	const handleMouseLeave = () => {
		Animated.parallel([
			Animated.spring(scaleAnimator, {
				toValue: 0,
				useNativeDriver: false,
			}),
			Animated.timing(backgroundColorAnimator, {
				toValue: 0,
				duration: 250,
				useNativeDriver: false,
			}),
			Animated.timing(shadowRadiusAnimator, {
				toValue: 0,
				duration: 250,
				useNativeDriver: false,
			}),
			Animated.timing(shadowOpacityAnimator, {
				toValue: 0,
				duration: 250,
				useNativeDriver: false,
			}),
			Animated.timing(elevationAnimator, {
				toValue: 0,
				duration: 250,
				useNativeDriver: false,
			}),
		]).start();
	};

	const animatedStyle = {
		backgroundColor: isOutlined ? colors.coolGray[100] : backgroundColorValue,
		borderColor: isOutlined ? backgroundColorValue : 'transparent',
		borderWidth: 2,
		transform: [{ scale: scaleValue }],
		shadowOpacity: shadowOpacityValue,
		shadowRadius: shadowRadiusValue,
		elevation: elevationValue,
	};

	const disableStyle = {
		backgroundColor: isOutlined ? colors.coolGray[100] : styleAnimate.Disabled.backgroundColor,
		borderColor: isOutlined ? styleAnimate.Disabled.backgroundColor : 'transparent',
		borderWidth: 2,
		scale: styleAnimate.Disabled.scale,
		shadowOpacity: styleAnimate.Disabled.shadowOpacity,
		shadowRadius: styleAnimate.Disabled.shadowRadius,
		elevation: styleAnimate.Disabled.elevation,
	};

	return (
		<Animated.View style={[style, isDisabled ? disableStyle : animatedStyle]}>
			<Pressable
				focusable={focusable}
				disabled={isDisabled}
				onHoverIn={handleMouseEnter}
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				onHoverOut={handleMouseLeave}
			>
				{children}
			</Pressable>
		</Animated.View>
	);
};


export default InteractiveBase;
