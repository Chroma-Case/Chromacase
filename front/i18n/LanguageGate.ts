import { RootState, useSelector } from '../state/Store';
import i18n from './i18n';

type LanguageGateProps = {
	children: JSX.Element;
};

/**
 * Gate to handle language update at startup and on every dispatch
 * @param props the children to render
 */
const LanguageGate = (props: LanguageGateProps) => {
	const language = useSelector((state: RootState) => state.language.value);
	i18n.changeLanguage(language);
	return props.children;
};

export default LanguageGate;
