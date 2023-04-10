import React from "react";
import { ElementProps } from "./ElementList";
import { RawElement } from "./RawElement";
import { Pressable } from "native-base";

export const Element = (props: ElementProps) => {
	if (props.type === "text" && props.data?.onPress) {
		return (
			<Pressable onPress={props.data.onPress}>
				<RawElement {...props} />
			</Pressable>
		);
	}
	return <RawElement {...props} />;
};
