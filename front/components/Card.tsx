import { useTheme, Box } from 'native-base';
import React from 'react';

export const CardBorderRadius = 10;

const cardBorder = (theme: ReturnType<typeof useTheme>) => ({
	borderColor: theme.colors.text[100],
	borderRadius: CardBorderRadius,
	borderWidth: 1 
})

const Card = (props: any) => {
	const theme = useTheme();
	return <Box {...props} style={{ ...props.style,  ...cardBorder(theme) }}>
		{ props.children }
	</Box>
}

export default Card;