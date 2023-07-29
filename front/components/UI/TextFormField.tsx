import React, { useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TextFieldBase, { TextFieldBaseProps } from './TextFieldBase';

interface TextFormFieldProps extends TextFieldBaseProps {
  error: string | null;
}

const ERROR_HEIGHT = 20;
const ERROR_PADDING_TOP = 8;

const TextFormField: React.FC<TextFormFieldProps> = ({ error, ...textFieldBaseProps }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const heightAnim = React.useRef(new Animated.Value(0)).current;
  const paddingTopAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(
        fadeAnim,
        {
          toValue: error ? 1 : 0,
          duration: 150,
          useNativeDriver: true
        }
      ),
      Animated.timing(
        heightAnim,
        {
          toValue: error ? ERROR_HEIGHT : 0,
          duration: 250,
          useNativeDriver: false
        }
      ),
      Animated.timing(
        paddingTopAnim,
        {
          toValue: error ? ERROR_PADDING_TOP : 0,
          duration: 250,
          useNativeDriver: false
        }
      ),
    ]).start();
  }, [error]);

  return (
    <View style={styles.wrapper}>
      <TextFieldBase
        iconColor={error ? '#f7253d' : undefined}
        {...textFieldBaseProps}
      />
      <Animated.View style={{...styles.errorContainer, opacity: fadeAnim, height: heightAnim, paddingTop: paddingTopAnim}}>
        <Icon name="alert-circle" size={16} color='#f7253d' />
        <Text style={styles.errorText}>{error}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
  },
  errorText: {
    color: '#f7253d',
    fontSize: 12,
    marginLeft: 8,
  },
});

export default TextFormField;