import { en, fr, sp } from './Translations';
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Translate from '../components/Translate';

export type AvailableLanguages = 'en' | 'fr' | 'sp';
export const DefaultLanguage: AvailableLanguages = 'en';

i18n
	.use(initReactI18next)
	.init({
		compatibilityJSON: 'v3',
		resources: {
			en: {
				translation: en
			},
			fr: {
				translation: fr
			},
			sp: {
				translation: sp
			}
		},
		lng: DefaultLanguage,
		fallbackLng: 'en',
		interpolation: {
			escapeValue: false
		}
	});

export default i18n;

/**
 * Typesafe translation method
 * @param textKey the key of th text to translate
 * @returns the translated text
 */
export const translate = (key: keyof typeof en, language?: AvailableLanguages) => {
	return i18n.t(key, {
		lng: language
	});
}

export { Translate };