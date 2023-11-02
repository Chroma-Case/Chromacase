import React from 'react';
import { Box, Button, Column, Icon, Popover, Row, Text, useBreakpointValue } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { ElementProps } from './ElementTypes';
import {
	getElementDropdownNode,
	getElementTextNode,
	getElementToggleNode,
	getElementRangeNode,
} from './ElementTypes';
import { ArrowDown2 } from 'iconsax-react-native';
import { useWindowDimensions } from 'react-native';
import useColorScheme from '../../hooks/colorScheme';

type RawElementProps = {
	element: ElementProps;
};

export const RawElement = ({ element }: RawElementProps) => {
	const { title, icon, type, helperText, description, disabled, data } = element;
	const screenSize = useBreakpointValue({ base: 'small', md: 'big' });
	const isSmallScreen = screenSize === 'small';
	const { width: screenWidth } = useWindowDimensions();
	const colorScheme = useColorScheme();
	const color = colorScheme === 'light' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)'

	return (
		<Column
			style={{
				width: '100%',
				paddingVertical: 10,
				paddingHorizontal: 20,
				justifyContent: 'space-between',
				alignContent: 'stretch',
				alignItems: 'center',
			}}
		>
			<Row
				style={{
					width: '100%',
					height: 45,
					justifyContent: 'space-between',
					alignContent: 'stretch',
					alignItems: 'center',
				}}
			>
				{icon}
				<Box
					style={{
						flexGrow: 1,
						flexShrink: 1,
						opacity: disabled ? 0.6 : 1,
						paddingLeft: icon ? 16 : 0,
					}}
				>
					<Column maxW={'90%'}>
						<Text isTruncated maxW={'100%'}>
							{title}
						</Text>
						{description && (
							<Text
								isTruncated
								maxW={'100%'}
								style={{
									opacity: 0.6,
									fontSize: 10,
								}}
							>
								{description}
							</Text>
						)}
					</Column>
				</Box>
				<Box
					style={{
						flexGrow: 0,
						flexShrink: 0,
					}}
				>
					<Row
						style={{
							alignItems: 'center',
							marginRight: 3,
						}}
					>
						{helperText && (
							<Popover
								trigger={(triggerProps) => (
									<Button
										{...triggerProps}
										color="gray.500"
										leftIcon={
											<Icon
												as={Ionicons}
												size={'md'}
												name="help-circle-outline"
											/>
										}
										variant="ghost"
									/>
								)}
							>
								<Popover.Content
									accessibilityLabel={`Additionnal information for ${title}`}
									style={{
										maxWidth: isSmallScreen
											? 0.9 * screenWidth
											: 0.2 * screenWidth,
									}}
								>
									<Popover.Arrow />
									<Popover.Body>{helperText}</Popover.Body>
								</Popover.Content>
							</Popover>
						)}
						{(() => {
							switch (type) {
								case 'text':
									return getElementTextNode(data, disabled ?? false);
								case 'toggle':
									return getElementToggleNode(data, disabled ?? false);
								case 'dropdown':
									return getElementDropdownNode(data, disabled ?? false);
								case 'range':
									return getElementRangeNode(data, disabled ?? false, title);
								case 'custom':
									return data;
								case 'sectionDropdown':
									return <ArrowDown2 size="24" color={color} variant="Outline" />;
								default:
									return <Text>Unknown type</Text>;
							}
						})()}
					</Row>
				</Box>
			</Row>
		</Column>
	);
};
