import React from "react";
import { StyleProp, ViewStyle } from "react-native";

import { Box, Center, Column, Row, Text, Divider, Switch } from "native-base";

type ElementType = "custom" | "default" | "text" | "toggle" | "dropdown";

type DropdownOption = {
	label: string;
	value: string;
};

const getElementTypeNode = (
	type: ElementType,
	text?: string,
	options?: DropdownOption[],
	onToggle?: (value: boolean) => void,
	toggleValue?: boolean,
	defaultToggleValue?: boolean,
	onSelect?: (value: string) => void
): React.ReactNode => {
	switch (type) {
		case "text":
			return (
				<Text
					style={{
						opacity: 0.6,
					}}
				>
					{text}
				</Text>
			);
		case "toggle":
			return (
				<Switch
					onToggle={onToggle}
					isChecked={toggleValue ?? false}
					defaultIsChecked={defaultToggleValue}
				/>
			);
		case "dropdown":
			return <Text>Dropdown</Text>;
		default:
			return <Text>Default</Text>;
	}
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
	onToggle?: (value: boolean) => void;
	toggleValue?: boolean;
	defaultToggleValue?: boolean;
	text?: string;
	options?: DropdownOption[];
	onSelect?: (value: string) => void;
};

const Element = ({
	title,
	icon,
	type,
	helperText,
	disabled,
	onPress,
	node,
	onToggle,
	toggleValue,
	defaultToggleValue,
	text,
	options,
	onSelect,
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
				{type === "custom"
					? node
					: getElementTypeNode(
							type ?? "default",
							text,
							options,
							onToggle,
							toggleValue,
							defaultToggleValue,
							onSelect
					  )}
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
