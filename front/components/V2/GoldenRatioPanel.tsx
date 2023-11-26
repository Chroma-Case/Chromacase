import { View, ViewStyle } from 'react-native';

const bigSideRatio = 1000;
const smallSideRatio = 618;

const bigSizePercent = '61.8%';
const smallSizePercent = '38.2%';

type GoldenRatioPanelProps = {
	direction: 'row' | 'column' | 'row-reverse' | 'column-reverse';
	header: React.ReactNode;
	children: React.ReactNode;
	style?: ViewStyle;
};

const isVerticalDir = (direction: GoldenRatioPanelProps['direction']) => {
	return direction === 'column' || direction === 'column-reverse';
};

const GoldenRatioPanel = ({ direction, header, children, style }: GoldenRatioPanelProps) => {
	const firstSizePercent = bigSizePercent;
	const secondSizePercent = smallSizePercent;
	const isVertical = isVerticalDir(direction);
	return (
		<View
			style={[
				{
					width: !isVertical ? '100%' : undefined,
					height: isVertical ? '100%' : undefined,
					display: 'flex',
					flexDirection: direction,
				},
				style,
			]}
		>
			<View
				style={{
					height: isVertical ? firstSizePercent : undefined,
					width: !isVertical ? firstSizePercent : undefined,
				}}
			>
				{header}
			</View>
			<View
				style={{
					height: isVertical ? secondSizePercent : undefined,
					width: !isVertical ? secondSizePercent : undefined,
				}}
			>
				{children}
			</View>
		</View>
	);
};

GoldenRatioPanel.defaultProps = {
	direction: 'row',
};

export default GoldenRatioPanel;
