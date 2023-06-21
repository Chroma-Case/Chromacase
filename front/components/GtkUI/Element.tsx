import React from 'react';
import { ElementProps } from './ElementTypes';
import { RawElement } from './RawElement';
import { Pressable, IPressableProps } from 'native-base';

export const Element = <T extends ElementProps>(props: T) => {
	let actionFunction: IPressableProps['onPress'] = null;

	switch (props.type) {
		case 'text':
			actionFunction = props.data?.onPress;
			break;
		case 'toggle':
			actionFunction = props.data?.onToggle;
			break;
		default:
			break;
	}

	if (!props?.disabled && actionFunction) {
		return (
			<Pressable onPress={actionFunction}>
				{({ isHovered }) => {
					return <RawElement element={props} isHovered={isHovered} />;
				}}
			</Pressable>
		);
	}
	return <RawElement element={props} />;
};
