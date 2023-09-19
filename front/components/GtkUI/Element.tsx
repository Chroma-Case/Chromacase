import React, { useRef, useState } from 'react';
import { ElementProps } from './ElementTypes';
import { RawElement } from './RawElement';
import { Pressable, IPressableProps, View, Text, Wrap, Column } from 'native-base';
import { Animated, StyleSheet } from 'react-native';
import InteractiveBase from '../UI/InteractiveBase';

export const Element = <T extends ElementProps>(props: T) => {
	let actionFunction: (() => void) | null | undefined  = null;
	const dropdownAnimator = useRef(new Animated.Value(1)).current;
	const [dropdownValue, setDropdownValue] = useState(false);
	
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
			backgroundColor: 'rgba(16, 16, 20, 0.50)',
		},
		onHover: {
			scale: 1,
			shadowOpacity: 0,
			shadowRadius: 0,
			elevation: 0,
			backgroundColor: 'rgba(32, 32, 40, 0.50)',
		},
		onPressed: {
			scale: 1,
			shadowOpacity: 0,
			shadowRadius: 0,
			elevation: 0,
			backgroundColor: 'rgba(16, 16, 20, 0.50)',
		},
		Disabled: {
			scale: 1,
			shadowOpacity: 0,
			shadowRadius: 0,
			elevation: 0,
			backgroundColor: 'rgba(16, 16, 20, 0.50)',
		}
	});

	if (!props?.disabled && actionFunction) {
		return (
			<Column>
				<InteractiveBase
					style={{width: '100%'}}
					styleAnimate={styleSetting}
					onPress={async ()  => {actionFunction?.();}}
				>
					<RawElement element={props} />
				</InteractiveBase>
				{
					props.type === 'sectionDropdown' && dropdownValue &&
					<View backgroundColor={'rgba(16,16,20,0.3)'}>
						{
							props.data.section.map((value, index) => (
								<View
									key={value?.toString() + index.toString()}
									style={{
										padding: 10,
										justifyContent: 'center',
										alignItems: 'center'
								}}>
									{value}
								</View>
							))
						}
					</View>
				}
			</Column>
		);
	}
	return <View style={{backgroundColor: 'rgba(16, 16, 20, 0.50)',}}><RawElement element={props}/></View>;
};
