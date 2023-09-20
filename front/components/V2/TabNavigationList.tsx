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
					// @ts-expect-error gap is not in the types because we have an old version of react-native
					gap: '8px',
				},
				props.style,
			]}
		>
			{props.children}
		</View>
	);
};

export default TabNavigationList;
