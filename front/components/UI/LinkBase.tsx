import React, { ReactNode, FunctionComponent } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  linkText: {
    textDecorationLine: 'underline',
    color: '#A3AFFC',
    fontWeight: '700',
  },
});

interface LinkBaseProps {
  children: ReactNode;
  onPress: () => void;
}

const LinkBase: FunctionComponent<LinkBaseProps> = ({ children, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={styles.linkText}>{children}</Text>
  </TouchableOpacity>
);

export default LinkBase;
