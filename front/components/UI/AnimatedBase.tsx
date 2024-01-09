import React, { useRef, useEffect } from 'react';
import { Animated, StyleProp, StyleSheet, ViewStyle } from 'react-native';

type StyleObject = Record<string, any>;
type InterpolatedStyleObject = Record<string, Animated.AnimatedInterpolation<any>>;

interface AnimatedBaseProps {
  style?: StyleObject;
  defaultStyle: StyleObject;
  hoverStyle: StyleObject;
  pressStyle: StyleObject;
  currentState: number;
  duration?: number;
  children?: React.ReactNode;
  styleContainer?: StyleProp<ViewStyle>;
}

const AnimatedBase: React.FC<AnimatedBaseProps> = ({
    style,
    defaultStyle,
    hoverStyle,
    pressStyle,
    currentState,
    children,
    duration = 250,
    styleContainer,
}) => {
  const animatedValues = useRef<Record<string, Animated.Value>>({}).current;

  const extractTransformKeys = (styleObject: StyleObject) => {
    return styleObject.transform
      ? styleObject.transform.map((t: any) => Object.keys(t)[0])
      : [];
  };

  useEffect(() => {
    const allStyleKeys = new Set([
      ...Object.keys(defaultStyle),
      ...Object.keys(hoverStyle),
      ...Object.keys(pressStyle),
    ]);

    allStyleKeys.forEach((key) => {
      if (!animatedValues[key]) {
        animatedValues[key] = new Animated.Value(0);
        console.log('key; ', key);
      }
    });

    const allTransformKeys = new Set([
      ...extractTransformKeys(defaultStyle),
      ...extractTransformKeys(hoverStyle),
      ...extractTransformKeys(pressStyle),
    ]);

    allTransformKeys.forEach((key) => {
      if (!animatedValues[key]) {
        animatedValues[key] = new Animated.Value(0);
        console.log('keyxx; ', key);
      }
    });
  }, [defaultStyle, hoverStyle, pressStyle]);

  useEffect(() => {
    animateToState(currentState);
  }, [currentState]);

  const getTransformValue = (key: string, style: StyleObject) => {
    const transformObject = style.transform?.find((t: any) => t.hasOwnProperty(key));
    return transformObject ? transformObject[key] : 0;
  };

  const interpolateStyle = (stateStyle: StyleObject): InterpolatedStyleObject => {
    const interpolatedStyle: InterpolatedStyleObject = {};
    const transform: any = [];

    Object.keys(animatedValues).forEach((key) => {
      if (stateStyle.transform?.some((t: any) => t.hasOwnProperty(key))) {
        const defaultValue = getTransformValue(key, defaultStyle);
        const hoverValue = getTransformValue(key, hoverStyle);
        const pressValue = getTransformValue(key, pressStyle);

        const interpolated = animatedValues[key]!.interpolate({
          inputRange: [0, 1, 2],
          outputRange: [defaultValue, hoverValue, pressValue],
        });

        transform.push({ [key]: interpolated });
      } else if (stateStyle[key]) {
        const defaultValue = defaultStyle[key] || 0;
        const hoverValue = hoverStyle[key] !== undefined ? hoverStyle[key] : defaultValue;
        const pressValue = pressStyle[key] !== undefined ? pressStyle[key] : defaultValue;

        interpolatedStyle[key] = animatedValues[key]!.interpolate({
          inputRange: [0, 1, 2],
          outputRange: [defaultValue, hoverValue, pressValue],
        });
      }
    });

    if (transform.length > 0) {
      interpolatedStyle.transform = transform;
    }
    
    return interpolatedStyle;
  };

  const animateToState = (stateValue: number) => {
    Object.keys(animatedValues).forEach((key) => {
      Animated.timing(animatedValues[key]!, {
        toValue: stateValue,
        duration: duration,
        useNativeDriver: false,
      }).start();
    });
  };

  const animatedStyle = StyleSheet.flatten([
    styleContainer,
    interpolateStyle(defaultStyle),
    interpolateStyle(hoverStyle),
    interpolateStyle(pressStyle),
  ]);

  return <Animated.View style={[style, animatedStyle]}>{children && children}</Animated.View>;
};

export default AnimatedBase;
