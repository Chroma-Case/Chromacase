import { Eye, EyeSlash, Icon } from 'iconsax-react-native';
import React, { useState } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Pressable } from 'react-native';
import InteractiveBase from './InteractiveBase';
import { Input, useTheme } from 'native-base';

export interface TextFieldBaseProps {
	style?: StyleProp<ViewStyle>;
	value?: string;
	icon?: Icon;
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
	const MyIcon: Icon = icon as Icon;
	const { colors } = useTheme();

	const styleAnimate = StyleSheet.create({
		Default: {
			scale: 1,
			shadowOpacity: 0.3,
			shadowRadius: 4.65,
			elevation: 8,
			backgroundColor: colors.coolGray[500],
		},
		onHover: {
			scale: 1,
			shadowOpacity: 0.37,
			shadowRadius: 7.49,
			elevation: 12,
			backgroundColor: colors.coolGray[400],
		},
		onPressed: {
			scale: 1,
			shadowOpacity: 0.23,
			shadowRadius: 2.62,
			elevation: 4,
			backgroundColor: colors.coolGray[600],
		},
		Disabled: {
			scale: 1,
			shadowOpacity: 0.3,
			shadowRadius: 4.65,
			elevation: 8,
			backgroundColor: colors.coolGray[500],
		},
	});

	return (
		<InteractiveBase
			style={[style, { borderRadius: 12, width: '100%' }]}
			styleAnimate={styleAnimate}
			focusable={false}
		>
			<View style={styles.container}>
				<View style={styles.iconContainerLeft}>
					{icon && (
						<MyIcon
							size={'20'}
							color={iconColor ? iconColor : isFocused ? '#5f74f7' : '#394694'}
							variant="Bold"
						/>
					)}
				</View>
				<View style={styles.input}>
					<Input
						variant="unstyled"
						style={{
							width: 0,
						}}
						autoComplete={autoComplete}
						placeholder={placeholder + (isRequired ? '*' : '')}
						placeholderTextColor={colors.text[700]}
						secureTextEntry={isSecret ? !isPasswordVisible : false}
						onFocus={() => setFocused(true)}
						onBlur={() => setFocused(false)}
						{...props}
					/>
				</View>
				{isSecret && (
					<Pressable
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
					</Pressable>
				)}
			</View>
		</InteractiveBase>
	);
};

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		gap: 5,
		width: '100%',
		paddingHorizontal: 12,
	},
	input: {
		flexGrow: 1,
		flexShrink: 1,
		paddingVertical: 8,
		// outlineStyle: 'none',
		width: 0,
	},
	iconContainerLeft: {
		flexGrow: 0,
		flexShrink: 0,
		width: 20,
	},
	iconContainerRight: {
		// outlineStyle: 'none',
		flexGrow: 0,
		flexShrink: 0,
		width: 20,
	},
});

export default TextFieldBase;
