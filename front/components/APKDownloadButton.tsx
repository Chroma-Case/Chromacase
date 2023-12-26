import { ArrowCircleDown2 } from 'iconsax-react-native';
import ButtonBase from './UI/ButtonBase';
import { translate } from '../i18n/i18n';
import { Linking } from 'react-native';
import { useState } from 'react';
import PopupCC from './UI/PopupCC';

const APKDownloadButton = () => {
	const [isOpen, setIsOpen] = useState(false);
	// 
	return (
		<>
			<ButtonBase
				style={{}}
				icon={ArrowCircleDown2}
				type={'filled'}
				title={translate('downloadAPK')}
				onPress={() => setIsOpen(true)}
			/>
			<PopupCC
				title={translate('downloadAPK')}
				description={translate('downloadAPKInstructions')}
				isVisible={isOpen}
				setIsVisible={setIsOpen}
			>
				<ButtonBase
					style={{}}
					icon={ArrowCircleDown2}
					type={'filled'}
					title={translate('downloadAPK')}
					onPress={() => Linking.openURL('https://github.com/Chroma-Case/Chromacase/releases')}
				/>	
			</PopupCC>
		</>
	);
};

export default APKDownloadButton;
