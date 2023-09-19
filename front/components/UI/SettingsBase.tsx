import React, { useState } from 'react';
import { StyleSheet, ActivityIndicator, View, Image } from 'react-native';
// import Ionicons from '@expo/vector-icons/Ionicons';
import InteractiveBase from './InteractiveBase';
import { Text, useTheme } from 'native-base';
// import { BlurView } from 'expo-blur';

interface SettingProps {
  icon: (size: number, color: string) => React.ReactNode;
  title: string;
  description?: string;
  onPress?: () => Promise<any>;
  children?: React.ReactNode;
}

const SettingBase: React.FC<SettingProps> = ({ title, description, onPress, icon, children}) => {
  const styleSetting = StyleSheet.create({
    Default: {
        scale: 1,
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
        backgroundColor: 'rgba(16, 16, 20, 0.50)',
    },
    onHover: {
        scale: 1,
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
        backgroundColor: 'rgba(32, 32, 40, 0.50)',
    },
    onPressed: {
        scale: 1,
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
        backgroundColor: 'rgba(16, 16, 20, 0.50)',
    },
    Disabled: {
        scale: 1,
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
        backgroundColor: 'rgba(16, 16, 20, 0.50)',
    }
  });

  return (
    <InteractiveBase
      style={[styles.container, {width: '100%'}]}
      styleAnimate={styleSetting}
      onPress={async () => {
        if (onPress) {
          await onPress();
        }
      }}
    >
        <View style={styles.content}>
          {icon(24, "#fff")}  
          <View style={styles.info}>
            <Text style={styles.text}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
          {children}
        </View>
    </InteractiveBase>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: 'rgba(16, 16, 20, 0.50)',
  },
  content: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
  },
  info: {
    flexDirection: 'column',
    marginHorizontal: 16,
    flex: 1,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  description: {
    color: '#fff',
    fontSize: 10,
  },
});

export default SettingBase;
