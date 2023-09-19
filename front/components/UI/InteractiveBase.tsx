import { Pressable } from 'native-base';
import React, { useRef } from 'react';
import { Animated, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface InteractiveBaseProps {
  children?: React.ReactNode;
  onPress?: () => Promise<any>;
  isDisabled?: boolean;
  isOutlined?: boolean;
  style?: StyleProp<ViewStyle>,
  styleAnimate: {
    Default: {
      scale: number,
      shadowOpacity: number,
      shadowRadius: number,
      elevation: number,
      backgroundColor: string,
    },
    onHover: {
      scale: number,
      shadowOpacity: number,
      shadowRadius: number,
      elevation: number,
      backgroundColor: string,
    },
    onPressed: {
      scale: number,
      shadowOpacity: number,
      shadowRadius: number,
      elevation: number,
      backgroundColor: string,
    },
    Disabled: {
      scale: number,
      shadowOpacity: number,
      shadowRadius: number,
      elevation: number,
      backgroundColor: string,
    }
  }
}

const InteractiveBase: React.FC<InteractiveBaseProps> = ({ children, onPress, style, styleAnimate, isDisabled = false, isOutlined = false }) => {
  const scaleAnimator = useRef(new Animated.Value(1)).current;
  const scaleValue = scaleAnimator.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [styleAnimate.Default.scale, styleAnimate.onHover.scale, styleAnimate.onPressed.scale],
  });
  const shadowOpacityAnimator = useRef(new Animated.Value(0)).current;
  const shadowOpacityValue = shadowOpacityAnimator.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [styleAnimate.Default.shadowOpacity, styleAnimate.onHover.shadowOpacity, styleAnimate.onPressed.shadowOpacity],
  });
  const shadowRadiusAnimator = useRef(new Animated.Value(0)).current;
  const shadowRadiusValue = shadowRadiusAnimator.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [styleAnimate.Default.shadowRadius, styleAnimate.onHover.shadowRadius, styleAnimate.onPressed.shadowRadius],
  });
  const elevationAnimator = useRef(new Animated.Value(0)).current;
  const elevationValue = elevationAnimator.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [styleAnimate.Default.elevation, styleAnimate.onHover.elevation, styleAnimate.onPressed.elevation],
  });
  const backgroundColorAnimator = useRef(new Animated.Value(0)).current;
  const backgroundColorValue = backgroundColorAnimator.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [styleAnimate.Default.backgroundColor, styleAnimate.onHover.backgroundColor, styleAnimate.onPressed.backgroundColor],
  });

  // Mouse Enter
  const handleMouseEnter = () => {
    Animated.parallel([
      Animated.spring(scaleAnimator, {
        toValue: 1,
        useNativeDriver: true,
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
  }
  // Mouse Down
  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnimator, {
        toValue: 2,
        useNativeDriver: true,
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
        useNativeDriver: true,
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
  }
  // Mouse Leave
  const handleMouseLeave = () => {
    Animated.parallel([
      Animated.spring(scaleAnimator, {
        toValue: 0,
        useNativeDriver: true,
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
        useNativeDriver: true,
      }),
    ]).start();
  }

  return (
    <Animated.View
      style={[
        style,
        isDisabled ? styleAnimate.Disabled : {
          backgroundColor: isOutlined ? 'rgba(0,0,0,0.3)' : backgroundColorValue,
          borderColor: isOutlined ? backgroundColorValue :  'transparent',
          borderWidth: 2,
          transform: [{ scale: scaleValue }],
          shadowOpacity: shadowOpacityValue,
          shadowRadius: shadowRadiusValue,
          elevation: elevationValue,
        },
      ]}
    >
        <Pressable
          disabled={isDisabled}
          onHoverIn={handleMouseEnter}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onHoverOut={handleMouseLeave}
          style={styles.container}
        >
          {children}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
});

export default InteractiveBase;