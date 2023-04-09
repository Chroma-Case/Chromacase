import React from "react";
import { StyleProp, ViewStyle } from "react-native";

import { Box, Center, Column, Row, Text, Divider } from "native-base";

type ElementProps = {
	title: string;
	icon?: React.ReactNode;
	disabled?: boolean;
	onPress?: () => void;
	// node is only used if type is "custom"
	node?: React.ReactNode;
};

const Element = ({ title, icon, disabled, onPress, node }: ElementProps) => {
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
			<Box>{node}</Box>
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
