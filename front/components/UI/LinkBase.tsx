import React, { useRef } from 'react';
import { TouchableOpacity, Animated, StyleSheet, Platform } from 'react-native';
import { Column, Text, useTheme } from 'native-base';

interface LinkBaseProps {
    text: string;
    onPress: () => void;
}

const LinkBase: React.FC<LinkBaseProps> = ({ text, onPress }) => {
    const underlineHeight = useRef(new Animated.Value(4)).current;
    const opacity = useRef(new Animated.Value(1)).current;
    const color = useRef(new Animated.Value(1)).current;
	const theme = useTheme();

    const handleMouseEnter = () => {
        if (Platform.OS === 'web') {
            Animated.timing(underlineHeight, {
                toValue: 20,
                duration: 250,
                useNativeDriver: false
            }).start();
        }
    };

    const handleMouseLeave = () => {
        if (Platform.OS === 'web') {
            Animated.timing(underlineHeight, {
                toValue: 4,
                duration: 250,
                useNativeDriver: false
            }).start();
        }
    };

    const handlePressIn = () => {
        Animated.timing(opacity, {
            toValue: 0.8,
            duration: 250,
            useNativeDriver: false
        }).start();
    };

    const handlePressOut = () => {
        Animated.timing(opacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: false
        }).start();
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Column>
                <Text>{text}</Text>
                <Animated.View style={[
                    styles.underline,
                    {
                        backgroundColor: theme.colors.primary[400],
                        height: underlineHeight,
                        opacity: opacity
                    }
                ]}/>
            </Column>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    underline: {
        width: '100%',
        position: 'absolute',
        zIndex: -1,
        bottom: 0,
    },
});

export default LinkBase;
