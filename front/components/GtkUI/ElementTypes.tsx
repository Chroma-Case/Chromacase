import { Select, Switch, Text } from "native-base";

export type ElementType = "custom" | "default" | "text" | "toggle" | "dropdown";

export type DropdownOption = {
	label: string;
	value: string;
};

export type ElementTextProps = {
	text: string;
	onPress?: () => void;
};

export type ElementToggleProps = {
	onToggle: () => void;
	value: boolean;
	defaultValue?: boolean;
};

export type ElementDropdownProps = {
	options: DropdownOption[];
	onSelect: (value: string) => void;
	value: string;
	defaultValue?: string;
};

export const getElementTextNode = (
	{ text }: ElementTextProps,
	disabled: boolean
) => {
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

export const getElementToggleNode = (
	{ onToggle, value, defaultValue }: ElementToggleProps,
	disabled: boolean
) => {
	return (
		<Switch
			onToggle={() => onToggle()}
			isChecked={value ?? false}
			defaultIsChecked={defaultValue}
			disabled={disabled}
		/>
	);
};

export const getElementDropdownNode = (
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
