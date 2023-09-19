import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Element } from './Element';
import useColorScheme from '../../hooks/colorScheme';
import { ElementProps } from './ElementTypes';

import { Box, Column, Divider } from 'native-base';
import InteractiveBase from '../UI/InteractiveBase';
import { StyleSheet } from 'react-native';

type ElementListProps = {
	elements: ElementProps[];
	style?: StyleProp<ViewStyle>;
};

const ElementList = ({ elements, style }: ElementListProps) => {
	const colorScheme = useColorScheme();
	// const isDark = colorScheme === 'dark';
	const elementStyle = {
		borderRadius: 10,
		shadowOpacity: 0.30,
		shadowRadius: 4.65,
		elevation: 8,
		backgroundColor: 'transparent',
		overflow: 'hidden',
	} as const;

	return (
		<Column style={[style, elementStyle]}>
			{elements.map((element, index) => (
				<Box key={element.title}>
					<Element {...element} />
					{index < elements.length - 1 && <Divider />}
				</Box>
			))}
		</Column>
	);
};

export default ElementList;
