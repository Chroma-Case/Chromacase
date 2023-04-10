import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import IconButton from "../IconButton";
import { Ionicons } from "@expo/vector-icons";
import { RawElement } from "./RawElement";
import { Element } from "./Element";

import {
	Box,
	Center,
	Button,
	Column,
	Row,
	Icon,
	Text,
	Divider,
	Switch,
	Popover,
	Pressable,
	useBreakpointValue,
	Select,
} from "native-base";

export type ElementProps = {
	title: string;
	icon?: React.ReactNode;
	type?: ElementType | "custom";
	helperText?: string;
	description?: string;
	disabled?: boolean;
	data?:
		| ElementTextProps
		| ElementToggleProps
		| ElementDropdownProps
		| React.ReactNode;
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
					elementsWithDividers.push(
						<Box key={elements[i]?.title}>
							<Element {...elements[i]} />
						</Box>
					);
					if (i < elements.length - 1) {
						elementsWithDividers.push(
							<Divider key={elements[i]?.title + "Divider"} />
						);
					}
				}
				return elementsWithDividers;
			})()}
		</Column>
	);
};

export default ElementList;
