import { View, Text } from 'react-native';
import { Pressable } from 'native-base';

type TabNavigationButtonProps = {
	icon?: string;
	label: string;
	onPress: () => void;
	onLongPress: () => void;
	isActive: boolean;
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
			{({ isPressed, isHovered }) => (
				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignSelf: 'stretch',
						alignItems: 'center',
						justifyContent: 'flex-start',
						padding: '10px',
						borderRadius: '8px',
						flexGrow: 0,
						backgroundColor: (() => {
							if (isPressed) {
								return 'rgba(0, 0, 0, 0.1)';
							} else if (isHovered) {
								return 'rgba(0, 0, 0, 0.05)';
							} else if (props.isActive) {
								return 'rgba(0, 0, 0, 0.1)';
							} else {
								return 'transparent';
							}
						})(),
					}}
				>
					{props.icon && (
						<View
							style={{
								marginRight: '10px',
							}}
						>
							<Text>{props.icon}</Text>
						</View>
					)}
					<View>
						<Text numberOfLines={1} selectable={false}>
							{props.label}
						</Text>
					</View>
				</View>
			)}
		</Pressable>
	);
};

TabNavigationButton.defaultProps = {
	icon: undefined,
	onPress: () => {},
	onLongPress: () => {},
	isActive: false,
};

export default TabNavigationButton;
