import { View } from 'native-base';

type SpacerProps = {
	width?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
	height?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
};

const Spacer = ({ width = 'md', height = 'md' }: SpacerProps) => {
	const str2size = (str: string) => {
		switch (str) {
			case 'xs':
				return 8;
			case 'sm':
				return 16;
			case 'md':
				return 20;
			case 'lg':
				return 32;
			case 'xl':
				return 40;
			case '2xl':
				return 80;
			default:
				return 20;
		}
	};

	return <View style={{ height: str2size(height), width: str2size(width) }}></View>;
};

export default Spacer;
