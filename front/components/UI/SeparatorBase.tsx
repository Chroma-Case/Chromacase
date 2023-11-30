import React, { FunctionComponent, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'native-base';

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
	const { colors } = useTheme();

	return (
		<View style={styles.container}>
			<View style={[styles.line, { backgroundColor: colors.text[700] }]} />
			<Text style={styles.text}>{children}</Text>
			<View style={[styles.line, { backgroundColor: colors.text[700] }]} />
		</View>
	);
};

export default SeparatorBase;
