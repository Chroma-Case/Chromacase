import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';

type TabNavigationListProps = {
	children: React.ReactNode;
	style?: StyleProp<ViewStyle>;
};

const TabNavigationList = (props: TabNavigationListProps) => {
	return (
		<View
			style={[
				{
					display: 'flex',
					alignItems: 'flex-start',
					alignSelf: 'stretch',
					flexDirection: 'column',
					gap: 8,
				},
				props.style,
			]}
		>
			{props.children}
		</View>
	);
};

export default TabNavigationList;
