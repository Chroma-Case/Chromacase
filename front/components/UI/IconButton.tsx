/* eslint-disable react/prop-types */
// Import required dependencies and components.
import { Icon } from 'iconsax-react-native';
import { useRef, useState, useMemo } from 'react';
import { Animated, StyleProp, TouchableOpacity, ViewStyle } from 'react-native';

// Default values for the component props.
const DEFAULT_SCALE_FACTOR: number = 1.25;
const DEFAULT_ANIMATION_DURATION: number = 250;
const DEFAULT_PADDING: number = 0;

// Define the type for the IconButton props.
type IconButtonProps = {
	/**
	 * Indicates if the button starts in an active state.
	 * @default false
	 */
	isActive?: boolean;

	/**
	 * Color of the icon.
	 */
	color: string;

	/**
	 * Optional color of the icon when active.
	 */
	colorActive?: string;

	/**
	 * Callback function triggered when the button is pressed.
	 */
	onPress?: () => void | Promise<void>;

	/**
	 * Size of the icon.
	 * @default 24
	 */
	size?: number;

	/**
	 * Icon to display.
	 */
	icon: Icon;

	/**
	 * Optional icon to display when active.
	 */
	iconActive?: Icon;

	/**
	 * Variant style of the icon.
	 * @default "Outline"
	 */
	variant?: 'Outline' | 'Bold' | 'Bulk' | 'Broken' | 'TwoTone';

	/**
	 * Variant style of the icon when active.
	 * @default "Outline"
	 */
	activeVariant?: 'Outline' | 'Bold' | 'Bulk' | 'Broken' | 'TwoTone';

	/**
	 * Custom style for the icon.
	 */
	style?: ViewStyle | ViewStyle[];

	/**
	 * Custom style for the icon's container.
	 */
	containerStyle?: ViewStyle | ViewStyle[];

	/**
	 * Scale factor when the icon animates on press.
	 * @default 1.25
	 */
	scaleFactor?: number;

	/**
	 * Duration of the icon animation in milliseconds.
	 * @default 250
	 */
	animationDuration?: number;

	/**
	 * Padding around the icon.
	 * @default 0
	 */
	padding?: number;
};

/**
 * `IconButton` Component
 *
 * Render an interactive icon that can toggle between active and inactive states.
 * Supports customization of colors, icons, animation speed, size, and more.
 *
 * Features:
 * - Can render two different icons for active and inactive states.
 * - Includes an animation that scales the icon when pressed.
 * - Supports custom styling for both the icon and its container.
 * - Accepts various icon variants for flexibility in design.
 *
 * Usage:
 *
 * ```jsx
 * <IconButton
 *     color="#000"
 *     icon={SomeIcon}
 *     onPress={() => console.log('Icon pressed!')}
 * />
 * ```
 *
 * To use with active states:
 *
 * ```jsx
 * <IconButton
 *     isActive={true}
 *     color="#000"
 *     colorActive="#ff0000"
 *     icon={SomeIcon}
 *     iconActive={SomeActiveIcon}
 *     onPress={() => console.log('Icon toggled!')}
 * />
 * ```
 *
 * Note: If `iconActive` is provided but `colorActive` is not,
 * the `color` prop will be used for both active and inactive states.
 */
const IconButton: React.FC<IconButtonProps> = ({
	isActive = false,
	color,
	colorActive,
	onPress,
	size = 24,
	icon: Icon,
	iconActive: IconActive,
	variant = 'Outline',
	activeVariant = 'Outline',
	style,
	containerStyle,
	scaleFactor = DEFAULT_SCALE_FACTOR,
	animationDuration = DEFAULT_ANIMATION_DURATION,
	padding = DEFAULT_PADDING,
}) => {
	// State to track active status.
	const [isActiveState, setIsActiveState] = useState<boolean>(isActive);

	// Animation values.
	const scaleValue: Animated.Value = useRef(new Animated.Value(1)).current;
	const animateValue: Animated.Value = useRef(new Animated.Value(isActive ? 0 : 1)).current;

	// Check for active icon.
	const hasActiveIcon: boolean = !!IconActive;

	// Interpolation for icon colors between active and inactive states.
	const colorValue: Animated.AnimatedInterpolation<string | number> = animateValue.interpolate({
		inputRange: [0, 1],
		outputRange: [color, colorActive || color],
	});

	// Combine styles for the icon container.
	const combinedContainerStyle: StyleProp<ViewStyle> = useMemo<
		(ViewStyle | ViewStyle[] | undefined)[]
	>(
		() => [
			{
				position: 'relative',
				// Adjust width and height to account for specified padding. Since the icons
				// are absolutely positioned inside the container, the container's size needs
				// to include the padding to ensure the icons are properly centered and spaced.
				width: size + padding * 2,
				height: size + padding * 2,
				justifyContent: 'center',
				alignItems: 'center',
			},
			containerStyle,
		],
		[padding, containerStyle]
	);

	/**
	 * Toggles the active state of the icon.
	 * Executes the onPress callback and triggers the animation.
	 */
	const toggleState = async () => {
		// Execute onPress if provided.
		if (onPress) {
			await onPress();
		}

		// Toggle isActiveState.
		setIsActiveState(!isActiveState);

		// Animation sequences.
		const animations: Animated.CompositeAnimation[] = [
			Animated.sequence([
				Animated.timing(scaleValue, {
					toValue: scaleFactor,
					duration: animationDuration,
					useNativeDriver: true,
				}),
				Animated.timing(scaleValue, {
					toValue: 1,
					duration: animationDuration,
					useNativeDriver: true,
				}),
			]),
		];

		if (hasActiveIcon || colorActive) {
			animations.push(
				Animated.timing(animateValue, {
					toValue: isActiveState ? 1 : 0,
					duration: animationDuration,
					useNativeDriver: true,
				})
			);
		}

		// Start animations in parallel.
		Animated.parallel(animations).start();
	};

	return (
		<TouchableOpacity activeOpacity={1} onPress={toggleState} style={combinedContainerStyle}>
			{hasActiveIcon && (
				<Animated.View
					style={[
						{
							padding: padding,
							color: colorValue,
							opacity: animateValue.interpolate({
								inputRange: [0, 1],
								outputRange: [1, 0],
							}),
							position: 'absolute',
							transform: [{ scale: scaleValue }],
						},
						style,
					]}
				>
					<IconActive size={size} variant={activeVariant} />
				</Animated.View>
			)}
			<Animated.View
				style={[
					{
						padding: padding,
						color: colorValue,
						opacity: animateValue,
						position: 'absolute',
						transform: [{ scale: scaleValue }],
					},
					style,
				]}
			>
				<Icon size={size} variant={variant} />
			</Animated.View>
		</TouchableOpacity>
	);
};

export default IconButton;
