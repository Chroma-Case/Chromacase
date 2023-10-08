import { View } from 'react-native';
import { Pressable, Text } from 'native-base';
import React from 'react';

type TabNavigationButtonProps = {
	icon?: React.ReactNode;
	label: string;
	onPress: () => void;
	onLongPress: () => void;
	isActive: boolean;
	isCollapsed: boolean;
};

const TabNavigationButton = (props: TabNavigationButtonProps) => {
	return (
		<Pressable
			onPress={props.onPress}
			onLongPress={props.onLongPress}
			style={{
				width: '100%',
			}}
		>
			{({ isPressed, isHovered }) => {
				let boxShadow: string | undefined = undefined;
				if (isHovered) {
					boxShadow = '0px 0px 16px 0px rgba(0, 0, 0, 0.25)';
				} else if (props.isActive) {
					boxShadow = '0px 0px 8px 0px rgba(0, 0, 0, 0.25)';
				}
				return (
					<View
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignSelf: 'stretch',
							alignItems: 'center',
							justifyContent: 'flex-start',
							padding: 10,
							borderRadius: 8,
							flexGrow: 0,
							// @ts-expect-error boxShadow isn't yet supported by react native
							boxShadow: boxShadow,
							backdropFilter: 'blur(2px)',
							backgroundColor: (() => {
								if (isPressed) {
									return 'rgba(0, 0, 0, 0.1)';
								} else if (isHovered) {
									return 'rgba(231, 231, 232, 0.2)';
								} else if (props.isActive) {
									return 'rgba(16, 16, 20, 0.5)';
								} else {
									return 'transparent';
								}
							})(),
						}}
					>
						{props.icon && (
							<View
								style={{
									marginRight: props.isCollapsed ? undefined : 10,
								}}
							>
								{props.icon}
							</View>
						)}
						{!props.isCollapsed && (
							<Text numberOfLines={1} selectable={false}>
								{props.label}
							</Text>
						)}
					</View>
				);
			}}
		</Pressable>
	);
};

TabNavigationButton.defaultProps = {
	icon: undefined,
	onPress: () => {},
	onLongPress: () => {},
	isActive: false,
	isCollapsed: false,
};

export default TabNavigationButton;
