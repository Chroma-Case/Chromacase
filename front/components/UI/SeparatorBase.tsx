import React, { FunctionComponent, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'native-base';
import useColorScheme from '../../hooks/colorScheme';

const styles = StyleSheet.create({
	line: {
		flex: 1,
		height: 2,
	},
	container: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 2,
	},
	text: {
		paddingHorizontal: 16,
	},
});

interface SeparatorBaseProps {
	children: ReactNode;
}

const SeparatorBase: FunctionComponent<SeparatorBaseProps> = ({ children }) => {
	const colorScheme = useColorScheme();
	const { colors } = useTheme();
	const color = colorScheme === 'light' ? colors.black[500] : '#FFFFFF';
	
	return (
		<View style={styles.container}>
			<View style={[styles.line, {backgroundColor: color}]} />
			<Text style={styles.text}>{children}</Text>
			<View style={[styles.line, {backgroundColor: color}]} />
		</View>
	);
}

export default SeparatorBase;
