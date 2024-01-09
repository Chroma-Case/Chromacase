import { useState, useCallback } from 'react';

const InteractionStates = {
  NORMAL: 0,
  HOVER: 1,
  PRESSED: 2,
};

interface InteractionStateProps {
  onHoverIn?: () => void;
  onHoverOut?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
}

const useInteractionState = ({ onHoverIn, onHoverOut, onPressIn, onPressOut }: InteractionStateProps = {}) => {
  const [state, setState] = useState(InteractionStates.NORMAL);

  const handleHoverIn = useCallback(() => {
    setState(InteractionStates.HOVER);
    if (onHoverIn) onHoverIn();
  }, [onHoverIn]);

  const handleHoverOut = useCallback(() => {
    setState(InteractionStates.NORMAL);
    if (onHoverOut) onHoverOut();
  }, [onHoverOut]);

  const handlePressIn = useCallback(() => {
    setState(InteractionStates.PRESSED);
    if (onPressIn) onPressIn();
  }, [onPressIn]);

  const handlePressOut = useCallback(() => {
    setState(InteractionStates.HOVER);
    if (onPressOut) onPressOut();
  }, [onPressOut]);

  return {
    state,
    handleHoverIn,
    handleHoverOut,
    handlePressIn,
    handlePressOut,
  };
};

export default useInteractionState;
