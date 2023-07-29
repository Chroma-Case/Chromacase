import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Supposons que nous utilisons la bibliothèque Ionicons pour les icônes

interface TextFormFieldProps {
  value?: string;
  icon?: string;
  placeholder?: string;
  autoComplete?:
  | 'birthdate-day'
  | 'birthdate-full'
  | 'birthdate-month'
  | 'birthdate-year'
  | 'cc-csc'
  | 'cc-exp'
  | 'cc-exp-day'
  | 'cc-exp-month'
  | 'cc-exp-year'
  | 'cc-number'
  | 'email'
  | 'gender'
  | 'name'
  | 'name-family'
  | 'name-given'
  | 'name-middle'
  | 'name-middle-initial'
  | 'name-prefix'
  | 'name-suffix'
  | 'password'
  | 'password-new'
  | 'postal-address'
  | 'postal-address-country'
  | 'postal-address-extended'
  | 'postal-address-extended-postal-code'
  | 'postal-address-locality'
  | 'postal-address-region'
  | 'postal-code'
  | 'street-address'
  | 'sms-otp'
  | 'tel'
  | 'tel-country-code'
  | 'tel-national'
  | 'tel-device'
  | 'username'
  | 'username-new'
  | 'off'
  | undefined;
  isSecret?: boolean;
  isRequired?: boolean;
  error?: string;
  onChangeText?: ((text: string) => void) | undefined;
}

const ERROR_HEIGHT = 20;
const ERROR_PADDING_TOP = 8;

const TextFormField: React.FC<TextFormFieldProps> = ({ value = '', placeholder = '', icon, autoComplete = 'off', isSecret = false, isRequired = false, error, ...props }) => {
  const [isPasswordVisible, setPasswordVisible] = useState(!isSecret);
  const [isFocused, setFocused] = useState(false);
  const [fieldValue, setFieldValue] = useState(value);
  const fadeAnim = React.useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
  const heightAnim = React.useRef(new Animated.Value(0)).current; // Initial value for height: 0
  const paddingTopAnim = React.useRef(new Animated.Value(0)).current; // Initial value for paddingTop: 0

  // Update fieldValue whenever value changes
  useEffect(() => {
    setFieldValue(value);
  }, [value]);

  // Animate the error message
  useEffect(() => {
    Animated.parallel([
      Animated.timing(
        fadeAnim,
        {
          toValue: error ? 1 : 0,
          duration: 500,
          useNativeDriver: true
        }
      ),
      Animated.timing(
        heightAnim,
        {
          toValue: error ? ERROR_HEIGHT : 0,
          duration: 250,
          useNativeDriver: false // height cannot be animated using native driver
        }
      ),
      Animated.timing(
        paddingTopAnim,
        {
          toValue: error ? ERROR_PADDING_TOP : 0,
          duration: 150,
          useNativeDriver: false // paddingTop cannot be animated using native driver
        }
      ),
    ]).start();
  }, [error]);

  const handleTextChange = (text: string) => {
    setFieldValue(text);
    if (props.onChangeText) {
      props.onChangeText(text);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, error && styles.error, isFocused && styles.containerFocused]}>
        <View style={styles.iconContainerLeft}>
          {icon && <Icon name={icon} size={24} color={error ? 'red' : (isFocused ? '#6075F9' : '#454562')} />}
        </View>
        <TextInput
          value={fieldValue}
          style={styles.input}
          autoComplete={autoComplete}
          placeholder={placeholder + (isRequired ? '*' : '')}
          placeholderTextColor='#454562'
          secureTextEntry={isSecret ? !isPasswordVisible : false}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChangeText={handleTextChange}
          {...props}
        />
        {isSecret && (
          <TouchableOpacity style={styles.iconContainerRight} onPress={() => setPasswordVisible(prevState => !prevState)}>
            <Icon name={isPasswordVisible ? 'eye-off' : 'eye'} size={24} color='#454562' />
          </TouchableOpacity>
        )}
      </View>
      <Animated.View style={{...styles.errorContainer, opacity: fadeAnim, height: heightAnim, paddingTop: paddingTopAnim}}>
        <Icon name="warning" size={16} color='red' />
        <Text style={styles.errorText}>{error}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22222D',
    borderRadius: 16,
  },
  error: {
  },
  containerFocused: {
  },
  input: {
    flex: 1,
    color: '#ffffff',
    paddingHorizontal: 16 + 24 + 16,
    paddingVertical: 16,
    outlineStyle: 'none',
  },
  iconContainerLeft: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  iconContainerRight: {
    position: 'absolute',
    outlineStyle: 'none',
    right: 16,
    zIndex: 1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 40,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 8,
  },
});

export default TextFormField;
