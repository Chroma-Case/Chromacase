import React from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import { Center, Button, Text, Switch, Slider, Select, Heading } from "native-base";
import { useLanguage } from "../../state/LanguageSlice";
import i18n, { AvailableLanguages, DefaultLanguage, translate, Translate } from "../../i18n/i18n";
import { RootState, useSelector } from "../../state/Store";
import { SettingsState, updateSettings } from "../../state/SettingsSlice";

const PreferencesView = ({navigation}) => {
	const dispatch = useDispatch();
	const language: AvailableLanguages = useSelector((state: RootState) => state.language.value);
	const settings = useSelector((state: RootState) => (state.settings.settings as SettingsState));
	return (
		<Center style={{ flex: 1}}>
			<Heading style={{ textAlign: "center" }}>
				<Translate translationKey='prefBtn'/>
			</Heading>
			<View style={{margin: 20, maxHeight: 100, maxWidth: 500, width: '80%'}}>
				<Select selectedValue={settings.colorScheme}
					placeholder={'Theme'}
					style={{ alignSelf: 'center'}}
					onValueChange={(newColorScheme) => {
						dispatch(updateSettings({ colorScheme: newColorScheme as any }))
					}}
				>
					<Select.Item label={ translate('dark') } value='dark'/>
					<Select.Item label={ translate('light') } value='light'/>
					<Select.Item label={ translate('system') } value='system'/>
				</Select>
			</View>

			<View style={{margin: 20, maxHeight: 100, maxWidth: 500, width: '80%'}}>
				<Select selectedValue={language}
					placeholder={translate('langBtn')} 
					style={{ alignSelf: 'center'}}
					onValueChange={(itemValue) => {
						dispatch(useLanguage(itemValue as AvailableLanguages));
					}}>
					<Select.Item label='Français' value='fr'/>
					<Select.Item label='English' value='en'/>
					<Select.Item label='Italiano' value='it'/>
					<Select.Item label='Espanol' value='sp'/>
				</Select>
			</View>

			<View style={{margin: 20, maxHeight: 100, maxWidth: 500, width: '80%'}}>
				<Select selectedValue={settings.preferedLevel}
					placeholder={ translate('diffBtn') }
					style={{ height: 50, width: 150, alignSelf: 'center'}}
					onValueChange={(itemValue) => {
						dispatch(updateSettings({ preferedLevel: itemValue as any }));
					}}>
					<Select.Item label={ translate('easy') } value='easy'/>
					<Select.Item label={ translate('medium') } value='medium'/>
					<Select.Item label={ translate('hard') } value='hard'/>
				</Select>
			</View>

			<View style={{margin: 20}}>
				<Text style={{ textAlign: 'center' }}>Color blind mode</Text>
				<Switch style={{ alignSelf: 'center'}} value={settings.colorBlind} colorScheme="primary"
					onValueChange={(enabled) => { dispatch(updateSettings({ colorBlind: enabled })) }}
				/>
			</View>

			<View style={{margin: 20, maxHeight: 100, maxWidth: 500, width: '80%'}}>
				<Text style={{ textAlign: "center" }}>Mic volume</Text>
				<Slider defaultValue={settings.micLevel} minValue={0} maxValue={1000} accessibilityLabel="hello world" step={10}
					onChangeEnd={(value) => { dispatch(updateSettings({ micLevel: value })) }}
				>
					<Slider.Track>
						<Slider.FilledTrack/>
					</Slider.Track>
					<Slider.Thumb/>
				</Slider>
			</View>

			<View style={{margin: 20, maxHeight: 100, maxWidth: 500, width: '80%'}}>
				<Select selectedValue={settings.preferedInputName}
					placeholder={'Device'}
					style={{ height: 50, width: 150, alignSelf: 'center'}}
					onValueChange={(itemValue: string) => { dispatch(updateSettings({ preferedInputName: itemValue })) }}
				>
					<Select.Item label='Mic_0' value='0'/>
					<Select.Item label='Mic_1' value='1'/>
					<Select.Item label='Mic_2' value='2'/>
				</Select>
			</View>
		</Center>
	)
}

export default PreferencesView;