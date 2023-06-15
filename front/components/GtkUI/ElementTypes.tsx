import { Select, Switch, Text, Icon, Row, Slider } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

export type ElementProps = {
	title: string;
	icon?: React.ReactNode;
	helperText?: string;
	description?: string;
	disabled?: boolean;
} & (
	| { type: 'text'; data: ElementTextProps }
	| { type: 'toggle'; data: ElementToggleProps }
	| { type: 'dropdown'; data: ElementDropdownProps }
	| { type: 'range'; data: ElementRangeProps }
	| { type: 'custom'; data: React.ReactNode }
);

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

export type ElementRangeProps = {
	onChange: (value: number) => void;
	value: number;
	defaultValue?: number;
	min: number;
	max: number;
	step?: number;
};

export const getElementTextNode = ({ text, onPress }: ElementTextProps, disabled: boolean) => {
	return (
		<Row
			style={{
				alignItems: 'center',
			}}
		>
			<Text
				style={{
					opacity: disabled ? 0.4 : 0.6,
				}}
			>
				{text}
			</Text>
			{onPress && (
				<Icon
					as={MaterialIcons}
					name="keyboard-arrow-right"
					size="xl"
					style={{
						opacity: disabled ? 0.4 : 0.6,
					}}
				/>
			)}
		</Row>
	);
};

export const getElementToggleNode = (
	{ onToggle, value, defaultValue }: ElementToggleProps,
	disabled: boolean
) => {
	return (
		<Switch
			// the callback is called by the Pressable component wrapping the entire row
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
				<Select.Item key={option.label} label={option.label} value={option.value} />
			))}
		</Select>
	);
};

export const getElementRangeNode = (
	{ onChange, value, defaultValue, min, max, step }: ElementRangeProps,
	disabled: boolean,
	title: string
) => {
	return (
		<Slider
			// this is a hot fix for now but ideally this input should be managed
			// by the value prop and not the defaultValue prop but it requires the
			// caller to manage the state of the continuous value which is not ideal
			defaultValue={value}
			// defaultValue={defaultValue}
			minValue={min}
			maxValue={max}
			step={step}
			isDisabled={disabled}
			onChangeEnd={onChange}
			accessibilityLabel={`Slider for ${title}`}
			width="200"
		>
			<Slider.Track>
				<Slider.FilledTrack />
			</Slider.Track>
			<Slider.Thumb />
		</Slider>
	);
};
