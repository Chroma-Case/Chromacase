import { en, fr, sp } from './Translations';
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { RootState, useSelector } from '../state/Store';
import React from 'react';


export type AvailableLanguages = 'en' | 'fr' | 'sp';
export const DefaultLanguage: AvailableLanguages = 'en';

i18n
	.use(initReactI18next)
	.init({
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

type TranslateProps = {
	key: keyof typeof en;
	format?: (translated: string) => string;
} 
/**
 * Translation component
 * @param param0 
 * @returns 
 */
export const Translate = ({ key, format }: TranslateProps) => {
	const selectedLanguage = useSelector((state: RootState) => state.language.value);
	const translated = translate(key, selectedLanguage);
	return React.Fragment({ children: [
		format ? format(translated) : translated
	]});
}