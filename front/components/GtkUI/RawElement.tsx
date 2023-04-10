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
	ElementDropdownProps,
	ElementTextProps,
	ElementToggleProps,
} from "./ElementTypes";

export const RawElement = (
	{ title, icon, type, helperText, description, disabled, data }: ElementProps,
	isHovered: boolean
) => {
	const screenSize = useBreakpointValue({ base: "small", md: "big" });
	const isSmallScreen = screenSize === "small";
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
			<Box
				style={{
					flexGrow: 1,
					opacity: disabled ? 0.6 : 1,
				}}
			>
				{icon}
				<Column>
					<Text isTruncated maxW={"95%"}>
						{title}
					</Text>
					{description && (
						<Text
							isTruncated
							maxW={"90%"}
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
			<Box>
				<Row
					style={{
						alignItems: "center",
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
