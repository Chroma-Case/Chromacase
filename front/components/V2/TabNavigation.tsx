import React from 'react';

export type NaviTab = {
	id: string;
	label: string;
	icon?: React.ReactNode;
	onPress?: () => void;
	onLongPress?: () => void;
	isActive?: boolean;
	isCollapsed?: boolean;
	iconName?: string;
};
