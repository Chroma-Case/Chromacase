import React, { useState } from 'react';
import { StyleSheet, ActivityIndicator, View, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import InteractiveBase from './InteractiveBase';
import { Text, useTheme } from 'native-base';
// import { BlurView } from 'expo-blur';

interface ButtonProps {
  title?: string;
  onPress?: () => Promise<any>;
  isDisabled?: boolean;
  icon?: string;
  iconImage?: string;
  isCollapsed?: boolean;
  type: 'filled' | 'outlined' | 'menu' | 'submenu';
}

const ButtonBase: React.FC<ButtonProps> = ({ title, onPress, isDisabled, icon, iconImage, isCollapsed, type = 'filled'}) => {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);

  const styleButton = StyleSheet.create({
    Default: {
        scale: 1,
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
        backgroundColor: colors.primary[400],
    },
    onHover: {
        scale: 1.02,
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
        backgroundColor: colors.primary[500],
    },
    onPressed: {
        scale: 0.98,
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        backgroundColor: colors.primary[600],
    },
    Disabled: {
        scale: 1,
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
        backgroundColor: colors.primary[400],
    }
  });

  const styleMenu = StyleSheet.create({
    Default: {
        scale: 1,
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
        backgroundColor: '#ff0000',
    },
    onHover: {
        scale: 1.01,
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
        backgroundColor: '#0ff000',
    },
    onPressed: {
        scale: 0.99,
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        backgroundColor: '#000',
    },
    Disabled: {
        scale: 1,
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
        backgroundColor: '#0000',
    }
  });

  const typeToStyleAnimator = {'filled': styleButton,'outlined': styleButton,'menu': styleMenu,'submenu': styleButton};

  return (
    <InteractiveBase
      style={styles.container}
      styleAnimate={typeToStyleAnimator[type]}
      onPress={async () => {
        if (onPress && !isDisabled) {
          setLoading(true);
          await onPress();
          setLoading(false);
        }
      }}
      isDisabled={isDisabled}
      isOutlined={type === 'outlined'}
    >
        {loading ? (
          <ActivityIndicator size="small" color={type === 'outlined' ? '#6075F9' : '#FFFFFF'} />
        ) : (
          <View style={styles.content}>
            {icon && <Ionicons name={icon} size={18} color={type === 'outlined' ? '#ff0000' : '#FFFFFF'} />}
            {iconImage && <Image source={{uri: iconImage}} style={styles.icon} />}
            {title && <Text style={styles.text}>{title}</Text>}
          </View>
        )}
    </InteractiveBase>
  );
};

const styleAnimate = StyleSheet.create({
  Default: {
      scale: 1,
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8,
      backgroundColor: '#00ff00',
  },
  onHover: {
      scale: 1.01,
      shadowOpacity: 0.37,
      shadowRadius: 7.49,
      elevation: 12,
      backgroundColor: '#0000ff',
  },
  onPressed: {
      scale: 0.99,
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
      backgroundColor: '#ff0000',
  },
  Disabled: {
      scale: 1,
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8,
      backgroundColor: '#000000',
  }
});

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
  },
  content: {
    padding: 10,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 18,
    height: 18,
    // marginRight: 8,
  },
  text: {
    color: '#fff',
    marginHorizontal: 8
  },
});

export default ButtonBase;
