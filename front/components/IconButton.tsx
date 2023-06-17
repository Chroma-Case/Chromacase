import { Box, Button } from 'native-base';

type IconButtonProps = {
	icon: Parameters<typeof Button>[0]['leftIcon'];
} & Omit<Parameters<typeof Button>[0], 'leftIcon' | 'rightIcon'>;

// Wrapper around Button for IconButton as Native's one sucks <3
const IconButton = (props: IconButtonProps) => {
	return (
		<Box>
			<Button {...props} leftIcon={props.icon} width="fit-content" rounded="sm" />
		</Box>
	);
};

export default IconButton;
