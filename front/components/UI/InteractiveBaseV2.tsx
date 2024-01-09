import React from 'react';
import { Pressable } from 'react-native';

interface InteractiveBaseProps {
    handleHoverIn: () => void;
    handleHoverOut: () => void;
    handlePressIn: () => void;
    handlePressOut: () => void;
    children: React.ReactNode;
    style?: any;
}

const InteractiveBase: React.FC<InteractiveBaseProps> = ({
    handleHoverIn,
    handleHoverOut,
    handlePressIn,
    handlePressOut,
    children,
    style,
}) => {
  return (
    <Pressable
      style={style}
      onHoverIn={handleHoverIn}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onHoverOut={handleHoverOut}
    >
      {children}
    </Pressable>
  );
};

export default InteractiveBase;
