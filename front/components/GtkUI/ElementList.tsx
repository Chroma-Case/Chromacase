import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Element } from "./Element";

import {
	ElementTextProps,
	ElementToggleProps,
	ElementDropdownProps,
	ElementRangeProps,
	ElementType,
} from "./ElementTypes";

import {
	Box,
	Column,
	Divider,
} from "native-base";

export type ElementProps = {
	title: string;
	icon?: React.ReactNode;
	type?: ElementType;
	helperText?: string;
	description?: string;
	disabled?: boolean;
	data?:
		| ElementTextProps
		| ElementToggleProps
		| ElementDropdownProps
		| ElementRangeProps
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
		overflow: "hidden",
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
