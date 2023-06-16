import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Element } from './Element';
import useColorScheme from '../../hooks/colorScheme';
import { ElementProps } from './ElementTypes';

import { Box, Column, Divider } from 'native-base';

type ElementListProps = {
	elements: ElementProps[];
	style?: StyleProp<ViewStyle>;
};

const ElementList = ({ elements, style }: ElementListProps) => {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';
	const elementStyle = {
		borderRadius: 10,
		boxShadow: isDark
			? '0px 0px 3px 0px rgba(255,255,255,0.6)'
			: '0px 0px 3px 0px rgba(0,0,0,0.4)',
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
