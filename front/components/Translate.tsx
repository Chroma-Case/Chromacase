import { Text } from "native-base";
import { translate } from "../i18n/i18n";
import { en } from "../i18n/Translations";
import { RootState, useSelector } from "../state/Store";
import { Text } from "native-base";

type TranslateProps = {
	translationKey: keyof typeof en;
	format?: (translated: string) => string;
} 
/**
 * Translation component
 * @param param0 
 * @returns 
 */
const Translate = ({ translationKey, format }: TranslateProps) => {
	const selectedLanguage = useSelector((state: RootState) => state.language.value);
	const translated = translate(translationKey, selectedLanguage);
	return <Text>{format ? format(translated) : translated}</Text>;
}

export default Translate;