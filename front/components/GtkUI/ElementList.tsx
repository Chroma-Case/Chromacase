import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Element } from './Element';
import { ElementProps } from './ElementTypes';
import { Box, Column, Divider } from 'native-base';

type ElementListProps = {
	elements: ElementProps[];
	style?: StyleProp<ViewStyle>;
};

const ElementList = ({ elements, style }: ElementListProps) => {
	const elementStyle = {
		borderRadius: 10,
		shadowOpacity: 0.3,
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
					{index < elements.length - 1 && <Divider bg="transparent" thickness="2" />}
				</Box>
			))}
		</Column>
	);
};

export default ElementList;
