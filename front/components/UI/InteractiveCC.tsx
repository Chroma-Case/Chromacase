import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, Pressable, ViewStyle, StyleProp } from 'react-native';

type StyleObject = Record<string, any>;
type InterpolatedStyleObject = Record<string, Animated.AnimatedInterpolation<any>>;

interface InteractiveCCProps {
    defaultStyle: StyleObject;
    hoverStyle: StyleObject;
    pressStyle: StyleObject;
    duration?: number;
    children?: React.ReactNode;
    onPress?: () => void | Promise<void>;
    isDisabled?: boolean;
    style?: StyleProp<ViewStyle>;
    styleContainer?: StyleProp<ViewStyle>;
}

const InteractiveCC: React.FC<InteractiveCCProps> = ({ defaultStyle, hoverStyle, pressStyle, children, onPress, isDisabled, style, styleContainer, duration=250 }) => {
    const animatedValues = useRef<Record<string, Animated.Value>>({}).current;

    const extractTransformKeys = (styleObject: StyleObject) => {
        const transformKeys = styleObject.transform ? styleObject.transform.map((t: any) => Object.keys(t)[0]) : [];
        return transformKeys;
    };

    useEffect(() => {
        // Initialisez les valeurs animées pour les propriétés de style non-transform
        const allStyleKeys = new Set([
            ...Object.keys(defaultStyle),
            ...Object.keys(hoverStyle),
            ...Object.keys(pressStyle),
        ]);

        allStyleKeys.forEach(key => {
            if (!animatedValues[key]) {
                animatedValues[key] = new Animated.Value(0);
            }
        });
        // Initialisez les valeurs animées pour les propriétés de style transform
        const allTransformKeys = new Set([
            ...extractTransformKeys(defaultStyle),
            ...extractTransformKeys(hoverStyle),
            ...extractTransformKeys(pressStyle),
        ]);

        allTransformKeys.forEach(key => {
            if (!animatedValues[key]) {
                animatedValues[key] = new Animated.Value(0);
            }
        });
    }, [defaultStyle, hoverStyle, pressStyle]);

    const getTransformValue = (key: string, style: StyleObject) => {
        const transformObject = style.transform?.find((t: any) => t.hasOwnProperty(key));
        return transformObject ? transformObject[key] : 0;
    };

    const interpolateStyle = (stateStyle: StyleObject, stateValue: number): InterpolatedStyleObject => {
        const interpolatedStyle: InterpolatedStyleObject = { ...stateStyle };
        const transform: any = [];

        Object.keys(animatedValues).forEach(key => {
            if (stateStyle.transform?.some((t: any) => t.hasOwnProperty(key))) {
                // Interpolation des transformations
                const defaultValue = getTransformValue(key, defaultStyle);
                const hoverValue = getTransformValue(key, hoverStyle);
                const pressValue = getTransformValue(key, pressStyle);

                const interpolated = animatedValues[key].interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: [defaultValue, hoverValue, pressValue],
                });

                transform.push({ [key]: interpolated });
            } else if (stateStyle[key]) {
                // Interpolation des autres styles
                const defaultValue = defaultStyle[key] || 0;
                const hoverValue = hoverStyle[key] !== undefined ? hoverStyle[key] : defaultValue;
                const pressValue = pressStyle[key] !== undefined ? pressStyle[key] : defaultValue;

                interpolatedStyle[key] = animatedValues[key].interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: [defaultValue, hoverValue, pressValue],
                });
            }
        });

        interpolatedStyle.transform = transform;
        return interpolatedStyle;
    };

    const animateToState = (stateValue: number) => {
        Object.keys(animatedValues).forEach(key => {
            Animated.timing(animatedValues[key], {
                toValue: stateValue,
                duration: duration,
                useNativeDriver: true, // Ajustez en fonction des propriétés animées
            }).start();
        });
    };

    const handleMouseEnter = () => animateToState(1);
    const handlePressIn = () => animateToState(2);
    const handlePressOut = () => {
        animateToState(1);
        if (onPress && !isDisabled) {
            onPress();
        }
    };
    const handleMouseLeave = () => animateToState(0);

    const animatedStyle = StyleSheet.flatten([
        styleContainer,
        interpolateStyle(defaultStyle, 0),
        interpolateStyle(hoverStyle, 1),
        interpolateStyle(pressStyle, 2),
    ]);

    return (
        <Animated.View style={animatedStyle}>
            <Pressable
                style={[styles.content, style]}
                focusable={false}
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

const styles = StyleSheet.create({
	content: {
		width: '100%',
		height: '100%',
	},
});

export default InteractiveCC;
