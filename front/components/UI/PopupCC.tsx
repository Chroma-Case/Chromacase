import { Text, Heading } from 'native-base';
import ButtonBase from './ButtonBase';
import { View } from 'react-native';
import { CloseSquare } from 'iconsax-react-native';
import { ReactNode } from 'react';
import Modal from 'react-native-modal';
import React from 'react';
import GlassmorphismCC from './Glassmorphism';

type PopupCCProps = {
	title?: string;
	description?: string;
	children?: ReactNode;
	isVisible: boolean;
	setIsVisible?: (isVisible: boolean) => void;
};

const PopupCC = ({ title, description, children, isVisible, setIsVisible }: PopupCCProps) => {
	return (
		<Modal
			backdropOpacity={0.75}
			isVisible={isVisible}
			style={{
				display: 'flex',
				alignContent: 'center',
				alignSelf: 'center',
				alignItems: 'center',
			}}
		>
			<GlassmorphismCC>
				<View
					style={{
						maxWidth: 800,
						padding: 20,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'stretch',
						justifyContent: 'flex-start',
						gap: 10,
						position: 'relative',
					}}
				>
					{setIsVisible !== undefined && (
						<ButtonBase
							style={{
								position: 'absolute',
								top: 10,
								right: 10,
								zIndex: 100,
							}}
							type="menu"
							icon={CloseSquare}
							onPress={async () => setIsVisible(false)}
						/>
					)}
					{title !== undefined && (
						<Heading
							size="md"
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'space-between',
							}}
						>
							<Text style={{ flex: 1 }}>{title}</Text>
						</Heading>
					)}
					{description !== undefined && <Text>{description}</Text>}
					{children !== undefined && children}
				</View>
			</GlassmorphismCC>
		</Modal>
	);
};

export default PopupCC;
