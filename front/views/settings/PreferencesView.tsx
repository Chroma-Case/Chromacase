import React from 'react';
import createTabRowNavigator from '../../components/navigators/TabRowNavigator';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChangePasswordForm from '../../components/forms/changePasswordForm';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import ChangeEmailForm from '../../components/forms/changeEmailForm';
import { Box } from "native-base";
import ProfileSettings from './SettingsProfileView';
import NotificationsView from './NotificationView';
import API, { APIError } from '../../API';
import PrivacyView from './PrivacyView';
import { SettingsState, updateSettings } from '../../state/SettingsSlice';

import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Center, Button, Text, Switch, Slider, Select, Heading, VStack } from "native-base";
import { useLanguage } from "../../state/LanguageSlice";
import i18n, { AvailableLanguages, DefaultLanguage, Translate, translate } from "../../i18n/i18n";
import { RootState } from '../../state/Store';

export const PreferencesView = ({navigation}: any) => {
	const dispatch = useDispatch();
	const language: AvailableLanguages = useSelector((state: RootState) => state.language.value);
	const settings = useSelector((state: RootState) => (state.settings.settings as SettingsState));
	return (
		<VStack>
			<Heading my={5} style={{ textAlign: "center" }}>{translate('prefBtn')}</Heading>

			<Center style={{ flex: 1}}>
				<VStack width={'100%'} style={{maxWidth: 800}}>
					<Box my={1} bgColor={"gray.200"} py={3} px={2}>
						<Select selectedValue={settings.colorScheme}
							placeholder={'Theme'}
							fontWeight={'extrabold'}
							variant='unstyled'
							style={{ alignSelf: 'center'}}
							onValueChange={(newColorScheme) => {
								dispatch(updateSettings({ colorScheme: newColorScheme as any }))
							}}
						>
							<Select.Item label={ translate('dark') } value='dark'/>
							<Select.Item label={ translate('light') } value='light'/>
							<Select.Item label={ translate('system') } value='system'/>
						</Select>
					</Box>

					<Box my={1} bgColor={"gray.200"} py={3} px={2}>
						<Select selectedValue={language}
							placeholder={translate('langBtn')} 
							fontWeight={'extrabold'}
							variant='unstyled'
							style={{ alignSelf: 'center'}}
							onValueChange={(itemValue) => {
								dispatch(useLanguage(itemValue as AvailableLanguages));
							}}>
							<Select.Item label='Français' value='fr'/>
							<Select.Item label='English' value='en'/>
							<Select.Item label='Espanol' value='sp'/>
						</Select>
					</Box>

					<Box my={1} bgColor={"gray.200"} py={3} px={2}>
						<Select selectedValue={settings.preferedLevel}
							placeholder={ translate('diffBtn') }
							variant='unstyled'
							fontWeight={'extrabold'}
							style={{alignSelf: 'center'}}
							onValueChange={(itemValue) => {
								dispatch(updateSettings({ preferedLevel: itemValue as any }));
							}}>
							<Select.Item label={ translate('easy') } value='easy'/>
							<Select.Item label={ translate('medium') } value='medium'/>
							<Select.Item label={ translate('hard') } value='hard'/>
						</Select>
					</Box>

					<Box my={1} bgColor={"gray.200"} py={3} px={2}>
						<Select selectedValue={settings.preferedInputName}
							placeholder={'Device'}
							variant='unstyled'
							fontWeight={'extrabold'}
							style={{ alignSelf: 'center'}}
							onValueChange={(itemValue: string) => { dispatch(updateSettings({ preferedInputName: itemValue })) }}
						>
							<Select.Item label='Mic_0' value='0'/>
							<Select.Item label='Mic_1' value='1'/>
							<Select.Item label='Mic_2' value='2'/>
						</Select>
					</Box>

					<Box my={1} bgColor={"gray.200"} py={5} px={2} style={{ flex: 3, flexDirection: 'row', justifyContent: 'space-between' }}>
						<Text fontWeight={'bold'} style={{ textAlign: "center" }}>Color blind mode</Text>
						<Switch style={{ alignSelf: 'center'}} value={settings.colorBlind} colorScheme="primary"
							onValueChange={(enabled) => { dispatch(updateSettings({ colorBlind: enabled })) }}
						/>
					</Box>

					<Box my={1} bgColor={"gray.200"} py={3} px={2}>
						<Text style={{ textAlign: "center" }}>Mic volume</Text>
						<Slider defaultValue={settings.micLevel} minValue={0} maxValue={1000} accessibilityLabel="hello world" step={10}
							onChangeEnd={(value) => { dispatch(updateSettings({ micLevel: value })) }}
						>
							<Slider.Track>
								<Slider.FilledTrack/>
							</Slider.Track>
							<Slider.Thumb/>
						</Slider>
					</Box>
				</VStack>
			</Center>
		</VStack>
	);
}

export default PreferencesView;