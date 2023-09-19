import { Eye, EyeSlash } from 'iconsax-react-native';
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import InteractiveBase from './InteractiveBase';
import { Input } from 'native-base';

export interface TextFieldBaseProps {
	style?: StyleProp<ViewStyle>;
	value?: string;
	icon?: (size: string, color: string) => React.ReactNode;
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

const TextFieldBase: React.FC<TextFieldBaseProps> = ({
	placeholder = '',
	style,
	icon,
	iconColor,
	autoComplete = 'off',
	isSecret = false,
	isRequired = false,
	...props
}) => {
	const [isPasswordVisible, setPasswordVisible] = useState(!isSecret);
	const [isFocused, setFocused] = useState(false);

	const styleAnimate = StyleSheet.create({
		Default: {
			scale: 1,
			shadowOpacity: 0.3,
			shadowRadius: 4.65,
			elevation: 8,
			backgroundColor: 'rgba(16,16,20,0.5)',
		},
		onHover: {
			scale: 1,
			shadowOpacity: 0.37,
			shadowRadius: 7.49,
			elevation: 12,
			backgroundColor: 'rgba(16,16,20,0.45)',
		},
		onPressed: {
			scale: 1,
			shadowOpacity: 0.23,
			shadowRadius: 2.62,
			elevation: 4,
			backgroundColor: 'rgba(16,16,20,0.55)',
		},
		Disabled: {
			scale: 1,
			shadowOpacity: 0.3,
			shadowRadius: 4.65,
			elevation: 8,
			backgroundColor: 'rgba(16,16,20,0.5)',
		},
	});

	return (
		<InteractiveBase style={[style, { borderRadius: 12 }]} styleAnimate={styleAnimate}>
			<View style={styles.container}>
				<View style={styles.iconContainerLeft}>
					{icon && icon('20', iconColor ? iconColor : isFocused ? '#5f74f7' : '#394694')}
				</View>
				<Input
					variant="unstyled"
					w="100%"
					style={[styles.input, icon ? {} : { paddingLeft: 12 }]}
					autoComplete={autoComplete}
					placeholder={placeholder + (isRequired ? '*' : '')}
					placeholderTextColor="rgba(255, 255, 255, 0.7)"
					secureTextEntry={isSecret ? !isPasswordVisible : false}
					onFocus={() => setFocused(true)}
					onBlur={() => setFocused(false)}
					{...props}
				/>
				{isSecret && (
					<TouchableOpacity
						style={styles.iconContainerRight}
						onPress={() => setPasswordVisible((prevState) => !prevState)}
					>
						{isPasswordVisible ? (
							<EyeSlash
								size="20"
								color={isFocused ? '#5f74f7' : '#394694'}
								variant="Bold"
							/>
						) : (
							<Eye
								size="20"
								color={isFocused ? '#5f74f7' : '#394694'}
								variant="Bold"
							/>
						)}
					</TouchableOpacity>
				)}
			</View>
		</InteractiveBase>
	);
};

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
	},
	input: {
		flex: 1,
		color: '#ffffff',
		paddingHorizontal: 12 + 20 + 12,
		paddingVertical: 12,
		outlineStyle: 'none',
	},
	iconContainerLeft: {
		position: 'absolute',
		left: 12,
		zIndex: 1,
	},
	iconContainerRight: {
		position: 'absolute',
		outlineStyle: 'none',
		right: 12,
		zIndex: 1,
	},
});

export default TextFieldBase;
