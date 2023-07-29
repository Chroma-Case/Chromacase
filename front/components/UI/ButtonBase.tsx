import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity, Text, ActivityIndicator, View, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface ButtonProps {
  title?: string;
  onPress?: () => Promise<any>;
  isDisabled?: boolean;
  icon?: string;
  iconImage?: string;
  isCollapsed?: boolean;
  isOutlined?: boolean;
}

const ButtonBase: React.FC<ButtonProps> = ({ title, onPress, isDisabled, icon, iconImage, isCollapsed, isOutlined = false }) => {
  const shouldCollapse = isCollapsed !== undefined ? isCollapsed : (!title && (icon || iconImage));
  const [loading, setLoading] = useState(false);
  const scaleValue = useRef(new Animated.Value(1)).current;
  const colorValue = useRef(new Animated.Value(0)).current;
  const backgroundColor = colorValue.interpolate({
    inputRange: [0, 1],
    outputRange: isOutlined ? ['transparent', 'transparent'] : ['#6075F9', '#4352ae'],
  });

  const borderColor = colorValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#6075F9', '#4352ae'],
  });

  const textColor = colorValue.interpolate({
    inputRange: [0, 1],
    outputRange: isOutlined ? ['#6075F9', '#4352ae'] : ['#ffffff', '#ffffff'],
  });

 // scale animation onClick
  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  // scale animation reset after onClick
  const handlePressOut = async () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 30,
    //   tension: 50,
      useNativeDriver: true,
    }).start();

    if (onPress && !isDisabled) {
      setLoading(true);
      await onPress();
      setLoading(false);
    }
  };

  // color animation onHover
  const handleMouseEnter = () => {
    Animated.timing(colorValue, {
      toValue: 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  // color animation reset after onHover
  const handleMouseLeave = () => {
    Animated.timing(colorValue, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={shouldCollapse ? styles.collapsedContainer : styles.container}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled || loading}
        style={styles.buttonContainer}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Animated.View
          style={[
            styles.button,
            {
              backgroundColor: isDisabled ? '#454562' : backgroundColor,
              transform: [{ scale: scaleValue }],
              borderWidth: isOutlined ? 2 : 0,
              borderColor,
              padding: (icon || iconImage) ? 12 : 16
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator size="small" color={isOutlined ? '#6075F9' : '#FFFFFF'} />
          ) : (
            <View style={styles.content}>
              {icon && <Ionicons name={icon} size={24} color={isOutlined ? '#6075F9' : '#FFFFFF'} />}
              {iconImage && <Image source={{uri: iconImage}} style={styles.icon} />}
              {title && <Animated.Text style={[styles.text, { color: textColor }]}>{title}</Animated.Text>}
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  collapsedContainer: {
    width: 'fit-content',
    // alignItems: 'center',
  },
  buttonContainer: {
    borderRadius: 16,
  },
  button: {
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    marginHorizontal: 8
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    // marginRight: 8,
  },
});

export default ButtonBase;
