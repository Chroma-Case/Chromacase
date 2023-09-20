import React, { FunctionComponent, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	line: {
		flex: 1,
		height: 2,
		backgroundColor: 'white',
	},
	container: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 2,
	},
	text: {
		color: 'white',
		paddingHorizontal: 16,
	},
});

interface SeparatorBaseProps {
	children: ReactNode;
}

const SeparatorBase: FunctionComponent<SeparatorBaseProps> = ({ children }) => (
	<View style={styles.container}>
		<View style={styles.line} />
		<Text style={styles.text}>{children}</Text>
		<View style={styles.line} />
	</View>
);

export default SeparatorBase;
