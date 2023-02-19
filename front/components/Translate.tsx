import { Text } from "native-base";
import { translate } from "../i18n/i18n";
import { en } from "../i18n/Translations";
import { RootState, useSelector } from "../state/Store";

type TranslateProps = {
	translationKey: keyof typeof en;
	format?: (translated: string) => string;
} & Parameters<typeof Text>[0];
/**
 * Translation component
 * @param param0 
 * @returns 
 */
const Translate = ({ translationKey, format, ...props }: TranslateProps) => {
	const selectedLanguage = useSelector((state: RootState) => state.language.value);
	const translated = translate(translationKey, selectedLanguage);

	return <Text {...props}>{format ? format(translated) : translated}</Text>;
}

export default Translate;