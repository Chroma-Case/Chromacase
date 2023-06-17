import { Button, Text } from 'native-base';
import Translate from './Translate';
import { RequireExactlyOne } from 'type-fest';

type TextButtonProps = Parameters<typeof Button>[0] &
	RequireExactlyOne<{
		label: string;
		translate: Parameters<typeof Translate>[0];
	}>;

const TextButton = (props: TextButtonProps) => {
	// accepts undefined variant, as it is the default variant
	const textColor = !props.variant || props.variant == 'solid' ? 'light.50' : undefined;

	return (
		<Button {...props}>
			{props.label !== undefined ? (
				<Text color={textColor}>{props.label}</Text>
			) : (
				<Translate color={textColor} {...props.translate} />
			)}
		</Button>
	);
};

export default TextButton;
