import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Element } from "./Element";
import useColorScheme from "../../hooks/colorScheme";

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
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";
	const elementStyle = {
		borderRadius: 10,
		boxShadow: isDark ?  "0px 0px 3px 0px rgba(255,255,255,0.6)" : "0px 0px 3px 0px rgba(0,0,0,0.4)",
		overflow: "hidden",
	};

	return (
		<Column style={[style, elementStyle]}>
			{elements.map((element, index, __) => (
				<Box key={element.title}>
					<Element {...element} />
					{ index < elements.length - 1 &&
						<Divider />
					}
				</Box>
			))}
		</Column>
	);
};

export default ElementList;
