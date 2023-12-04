import React from 'react';
import 'react-native';

declare module 'react-native' {
	interface PressableStateCallbackType {
		hovered?: boolean;
		focused?: boolean;
	}
	interface AccessibilityProps {
		tabIndex?: number;
	}
	interface ViewStyle {
		transitionProperty?: string;
		transitionDuration?: string;
	}
	interface TextProps {
		href?: string;
		hrefAttrs?: {
			rel?: 'noreferrer';
			target?: string;
		};
	}
	interface ViewProps {
		dataSet?: Record<string, string>;
		href?: string;
		hrefAttrs?: {
			rel: 'noreferrer';
			target?: '_blank';
		};
		onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
	}
}
