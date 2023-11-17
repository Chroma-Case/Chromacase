import React, { useState } from 'react';
import { ElementProps } from './ElementTypes';
import { RawElement } from './RawElement';
import { View, Column, useTheme } from 'native-base';
import { StyleSheet } from 'react-native';
import InteractiveBase from '../UI/InteractiveBase';

export const Element = <T extends ElementProps>(props: T) => {
	let actionFunction: (() => void) | null | undefined = null;
	const [dropdownValue, setDropdownValue] = useState(false);
	const { colors } = useTheme();

	switch (props.type) {
		case 'text':
			actionFunction = props.data?.onPress;
			break;
		case 'toggle':
			actionFunction = props.data?.onToggle;
			break;
		case 'sectionDropdown':
			actionFunction = () => {
				props.data.value = !props.data.value;
				setDropdownValue(!dropdownValue);
			};
			break;
		default:
			break;
	}

	const styleSetting = StyleSheet.create({
		Default: {
			scale: 1,
			shadowOpacity: 0,
			shadowRadius: 0,
			elevation: 0,
			backgroundColor: colors.coolGray[500],
		},
		onHover: {
			scale: 1,
			shadowOpacity: 0,
			shadowRadius: 0,
			elevation: 0,
			backgroundColor: colors.coolGray[700],
		},
		onPressed: {
			scale: 1,
			shadowOpacity: 0,
			shadowRadius: 0,
			elevation: 0,
			backgroundColor: colors.coolGray[500],
		},
		Disabled: {
			scale: 1,
			shadowOpacity: 0,
			shadowRadius: 0,
			elevation: 0,
			backgroundColor: colors.coolGray[500],
		},
	});

	if (!props?.disabled && actionFunction) {
		return (
			<Column>
				<InteractiveBase
					style={{ width: '100%' }}
					styleAnimate={styleSetting}
					onPress={async () => {
						actionFunction?.();
					}}
				>
					<RawElement element={props} />
				</InteractiveBase>
				{props.type === 'sectionDropdown' && dropdownValue && (
					<View>
						{props.data.section.map((value, index) => (
							<View
								key={value?.toString() + index.toString()}
								style={{
									padding: 10,
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								{value}
							</View>
						))}
					</View>
				)}
			</Column>
		);
	}
	return (
		<View style={{ backgroundColor: colors.coolGray[500] }}>
			<RawElement element={props} />
		</View>
	);
};
