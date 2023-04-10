import React from "react";
import { ElementProps } from "./ElementList";
import { RawElement } from "./RawElement";
import { Pressable } from "native-base";

export const Element = (props: ElementProps) => {
	let actionFunction = null as null | Function;

	switch (props.type) {
		case "text":
			actionFunction = props.data?.onPress;
			break;
		case "toggle":
			actionFunction = props.data?.onToggle;
			break;
		default:
			break;
	}

	if (actionFunction) {
		return (
			<Pressable onPress={actionFunction}>
				{({ isHovered }) => {
					return <RawElement element={props} isHovered={isHovered} />;
				}}
			</Pressable>
		);
	}
	return <RawElement element={props} />;
};
