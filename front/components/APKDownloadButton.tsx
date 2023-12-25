import { ArrowCircleDown2 } from 'iconsax-react-native';
import ButtonBase from './UI/ButtonBase';
import { translate } from '../i18n/i18n';
import { Linking } from 'react-native';

const APKDownloadButton = () => {
	return (
		<ButtonBase
			style={{}}
			icon={ArrowCircleDown2}
			type={'filled'}
			title={translate('downloadAPK')}
			onPress={() =>
				Linking.openURL('https://github.com/Chroma-Case/Chromacase/releases/download/v0.8.4/android-build.apk')
			}
		/>
	);
};

export default APKDownloadButton;
