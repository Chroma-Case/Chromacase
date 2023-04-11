import React from "react";
import {
	Box,
	Button,
	Column,
	Divider,
	Icon,
	Popover,
	Row,
	Text,
	useBreakpointValue,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { ElementProps } from "./ElementList";
import {
	getElementDropdownNode,
	getElementTextNode,
	getElementToggleNode,
	getElementRangeNode,
	ElementDropdownProps,
	ElementTextProps,
	ElementToggleProps,
	ElementRangeProps,
} from "./ElementTypes";

type RawElementProps = {
	element: ElementProps;
	isHovered?: boolean;
};

export const RawElement = ({ element, isHovered }: RawElementProps) => {
	const { title, icon, type, helperText, description, disabled, data } =
		element;
	const screenSize = useBreakpointValue({ base: "small", md: "big" });
	const isSmallScreen = screenSize === "small";
	return (
		<Row
			style={{
				width: "100%",
				height: 45,
				padding: 15,
				justifyContent: "space-between",
				alignContent: "stretch",
				alignItems: "center",
				backgroundColor: isHovered ? "#f5f5f5" : undefined,
			}}
		>
			<Box
				style={{
					flexGrow: 1,
					flexShrink: 100,
					opacity: disabled ? 0.6 : 1,
				}}
			>
				{icon}
				<Column maxW={"90%"}>
					<Text isTruncated maxW={"100%"}>
						{title}
					</Text>
					{description && (
						<Text
							isTruncated
							maxW={"100%"}
							style={{
								opacity: 0.6,
								fontSize: 12,
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
						alignItems: "center",
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
											size={"md"}
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
									maxWidth: isSmallScreen ? "90vw" : "20vw",
								}}
							>
								<Popover.Arrow />
								<Popover.Body>{helperText}</Popover.Body>
							</Popover.Content>
						</Popover>
					)}
					{(() => {
						switch (type) {
							case "text":
								return getElementTextNode(
									data as ElementTextProps,
									disabled ?? false
								);
							case "toggle":
								return getElementToggleNode(
									data as ElementToggleProps,
									disabled ?? false
								);
							case "dropdown":
								return getElementDropdownNode(
									data as ElementDropdownProps,
									disabled ?? false
								);
							case "range":
								return getElementRangeNode(
									data as ElementRangeProps,
									disabled ?? false,
									title
								);
							case "custom":
								return data as React.ReactNode;
							default:
								return <Text>Unknown type</Text>;
						}
					})()}
				</Row>
			</Box>
		</Row>
	);
};
