import React from "react";
import { StyleProp, ViewStyle } from "react-native";

import { Box, Center, Column, Row, Text, Divider, Switch } from "native-base";

type ElementType = "custom" | "default" | "text" | "toggle" | "dropdown";

type DropdownOption = {
	label: string;
	value: string;
};

type ElementTextProps = {
	text: string;
};

type ElementToggleProps = {
	onToggle: (value: boolean) => void;
	value: boolean;
	defaultValue?: boolean;
};

type ElementDropdownProps = {
	options: DropdownOption[];
	onSelect: (value: string) => void;
	value: string;
	defaultValue?: string;
};

const getElementTextNode = ({ text, type }: ElementTextProps) => {
	return (
		<Text
			style={{
				opacity: 0.6,
			}}
		>
			{text}
		</Text>
	);
};

const getElementToggleNode = ({
	onToggle,
	value,
	defaultValue,
}: ElementToggleProps) => {
	return (
		<Switch
			onToggle={onToggle}
			isChecked={value ?? false}
			defaultIsChecked={defaultValue}
		/>
	);
};

const getElementDropdownNode = ({
	options,
	onSelect,
	value,
	defaultValue,
}: ElementDropdownProps) => {
	return <Text>Dropdown</Text>;
};

type ElementProps = {
	title: string;
	icon?: React.ReactNode;
	type?: ElementType | "custom";
	helperText?: string;
	disabled?: boolean;
	onPress?: () => void;
	// node is only used if type is "custom"
	node?: React.ReactNode;
	data?: ElementTextProps | ElementToggleProps | ElementDropdownProps;
};

const Element = ({
	title,
	icon,
	type,
	helperText,
	disabled,
	onPress,
	node,
	data,
}: ElementProps) => {
	return (
		<Row
			style={{
				width: "100%",
				height: 45,
				padding: 15,
				justifyContent: "space-between",
				alignItems: "center",
			}}
		>
			<Box>
				{icon}
				<Text>{title}</Text>
			</Box>
			<Box>
				{(() => {
					switch (type) {
						case "text":
							return getElementTextNode(data as ElementTextProps);
						case "toggle":
							return getElementToggleNode(data as ElementToggleProps);
						case "dropdown":
							return getElementDropdownNode(data as ElementDropdownProps);
						case "custom":
							return node;
						default:
							return <Text>Unknown type</Text>;
					}
				})()}
			</Box>
		</Row>
	);
};

type ElementListProps = {
	elements: ElementProps[];
	style?: StyleProp<ViewStyle>;
};

const ElementList = ({ elements, style }: ElementListProps) => {
	const elementStyle = {
		borderRadius: 10,
		boxShadow: "0px 0px 3px 0px rgba(0,0,0,0.4)",
	};

	return (
		<Column style={[style, elementStyle]}>
			{(() => {
				const elementsWithDividers = [];
				for (let i = 0; i < elements.length; i++) {
					elementsWithDividers.push(<Element {...elements[i]} />);
					if (i < elements.length - 1) {
						elementsWithDividers.push(<Divider />);
					}
				}
				return elementsWithDividers;
			})()}
		</Column>
	);
};

export default ElementList;
