import { View } from 'react-native';
import { Flex, useMediaQuery, useTheme } from 'native-base';
import ButtonBase from './ButtonBase';
import { Discover, Icon } from 'iconsax-react-native';
import { translate } from '../../i18n/i18n';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { ComponentProps } from 'react';

const ScaffoldMobileCC = ({ state, descriptors, navigation }: BottomTabBarProps) => {
	const [isSmallScreen] = useMediaQuery({ maxWidth: 400 });
	const { colors } = useTheme();

	return (
		<View style={{ padding: 8, paddingTop: 0 }}>
			<Flex
				style={{
					width: '100%',
					flexDirection: 'row',
					backgroundColor: colors.coolGray[500],
					padding: 8,
					justifyContent: 'space-between',
					borderRadius: 8,
				}}
			>
				{state.routes.map((route, index) => {
					const { options } = descriptors[route.key]!;
					const label = options.title !== undefined ? options.title : route.name;
					const icon = options.tabBarIcon as Icon;
					const isFocused = state.index === index;

					return (
						<ButtonBase
							key={'key-menu-link-' + label}
							type="menu"
							icon={icon}
							title={
								isFocused && !isSmallScreen ? translate(label as any) : undefined
							}
							isDisabled={isFocused}
							iconVariant={isFocused ? 'Bold' : 'Outline'}
							onPress={() => {
								const event = navigation.emit({
									type: 'tabPress',
									target: route.key,
									canPreventDefault: true,
								});

								if (!isFocused && !event.defaultPrevented) {
									navigation.navigate(route.name, route.params);
								}
							}}
							onLongPress={() => {
								navigation.emit({
									type: 'tabLongPress',
									target: route.key,
								});
							}}
						/>
					);
				})}
			</Flex>
		</View>
	);
};

// This is needed to bypass a bug in react-navigation that calls custom tabBars weirdly
const Wrapper = (props: ComponentProps<typeof ScaffoldMobileCC>) => {
	return <ScaffoldMobileCC {...props} />;
}

export default Wrapper;
