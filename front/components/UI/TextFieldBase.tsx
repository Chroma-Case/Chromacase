import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Supposons que nous utilisons la bibliothèque Ionicons pour les icônes

export interface TextFieldBaseProps {
  value?: string;
  icon?: string;
  iconColor?: string;
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
  onChangeText?: ((text: string) => void) | undefined;
}

const TextFieldBase: React.FC<TextFieldBaseProps> = ({ placeholder = '', icon, iconColor, autoComplete = 'off', isSecret = false, isRequired = false, ...props }) => {
  const [isPasswordVisible, setPasswordVisible] = useState(!isSecret);
  const [isFocused, setFocused] = useState(false);

  return (
        <View style={styles.container}>
            <View style={styles.iconContainerLeft}>
                {icon && <Icon name={icon} size={24} color={iconColor ? iconColor : (isFocused ? '#6075F9' : '#454562')} />}
            </View>
            <TextInput
                style={styles.input}
                autoComplete={autoComplete}
                placeholder={placeholder + (isRequired ? '*' : '')}
                placeholderTextColor='#454562'
                secureTextEntry={isSecret ? !isPasswordVisible : false}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                {...props}
            />
            {isSecret && (
                <TouchableOpacity style={styles.iconContainerRight} onPress={() => setPasswordVisible(prevState => !prevState)}>
                    <Icon name={isPasswordVisible ? 'eye-off' : 'eye'} size={24} color='#454562' />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22222D',
    borderRadius: 16,
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
});

export default TextFieldBase;
