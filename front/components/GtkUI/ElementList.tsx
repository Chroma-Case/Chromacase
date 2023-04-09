import React from "react";
import { StyleProp, ViewStyle } from "react-native";

import { Box, Center, Column, Row, Text, Divider } from "native-base";

type ElementType = "custom" | "default" | "text" | "toggle" | "dropdown";

const getElementTypeNode = (
	type: ElementType,
	text?: string,
	dropdownItems?: string[],
	onToggle?: (value: boolean) => void
): React.ReactNode => {
	switch (type) {
		case "text":
			return <Text style={{
				color: "rgba(0, 0, 0, 0.6)",
			}}>{text}</Text>;
		case "toggle":
			return <Text>Toggle</Text>;
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
	text?: string;
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
	text,
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
					: getElementTypeNode(type ?? "default", text, undefined, onToggle)}
			</Box>
		</Row>
	);
};

type ElementListProps = {
	elements: ElementProps[];
	style?: StyleProp<ViewStyle>;
};

const ElementList = ({ elements, style }: ElementListProps) => {
	return (
		<Column
			style={{
				borderRadius: 10,
				boxShadow: "0px 0px 3px 0px rgba(0,0,0,0.4)",
				...style,
			}}
		>
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
