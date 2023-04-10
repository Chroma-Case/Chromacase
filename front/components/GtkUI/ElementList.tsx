import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import IconButton from "../IconButton";
import { Ionicons } from "@expo/vector-icons";

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
	useBreakpointValue,
	Select,
} from "native-base";

type ElementType = "custom" | "default" | "text" | "toggle" | "dropdown";

type DropdownOption = {
	label: string;
	value: string;
};

type ElementTextProps = {
	text: string;
};

type ElementToggleProps = {
	onToggle: (value: boolean) => void;
	value: boolean;
	defaultValue?: boolean;
};

type ElementDropdownProps = {
	options: DropdownOption[];
	onSelect: (value: string) => void;
	value: string;
	defaultValue?: string;
};

const getElementTextNode = ({ text }: ElementTextProps, disabled: boolean) => {
	return (
		<Text
			style={{
				opacity: disabled ? 0.4 : 0.6,
			}}
		>
			{text}
		</Text>
	);
};

const getElementToggleNode = (
	{ onToggle, value, defaultValue }: ElementToggleProps,
	disabled: boolean
) => {
	return (
		<Switch
			onToggle={onToggle}
			isChecked={value ?? false}
			defaultIsChecked={defaultValue}
			disabled={disabled}
		/>
	);
};

const getElementDropdownNode = (
	{ options, onSelect, value, defaultValue }: ElementDropdownProps,
	disabled: boolean
) => {
	return (
		<Select
			selectedValue={value}
			onValueChange={onSelect}
			defaultValue={defaultValue}
			variant="filled"
			isDisabled={disabled}
		>
			{options.map((option) => (
				<Select.Item
					key={option.label}
					label={option.label}
					value={option.value}
				/>
			))}
		</Select>
	);
};

type ElementProps = {
	title: string;
	icon?: React.ReactNode;
	type?: ElementType | "custom";
	helperText?: string;
	description?: string;
	disabled?: boolean;
	onPress?: () => void;
	data?:
		| ElementTextProps
		| ElementToggleProps
		| ElementDropdownProps
		| React.ReactNode;
};

const Element = ({
	title,
	icon,
	type,
	helperText,
	description,
	disabled,
	onPress,
	node,
	data,
}: ElementProps) => {
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
