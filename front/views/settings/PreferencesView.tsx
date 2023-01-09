import React from 'react';
import { View } from 'react-native';
import { Center, Button, Text, Switch, Slider, Select, Heading } from "native-base";
import { useLanguage } from "../../state/LanguageSlice";
import i18n, { AvailableLanguages, DefaultLanguage, translate } from "../../i18n/i18n";

const PreferencesView = ({navigation}) => {
    const dispatch = useDispatch();
    const language: AvailableLanguages = useSelector((state) => state.language.value);

    return (
        <Center style={{ flex: 1}}>
            <Heading style={{ textAlign: "center" }}>{ translate('prefBtn')}</Heading>

            <Button variant='outline' onPress={() => navigation.navigate('Settings')} style={{ margin: 10}}>{ translate('backBtn') }</Button>

            <View style={{margin: 20, maxHeight: 100, maxWidth: 500, width: '80%'}}>
                <Select selectedValue={undefined}
                placeholder={'Theme'}
                    style={{ alignSelf: 'center'}}
                    // onValueChange={(itemValue, itemIndex) => switch themes}
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
                    onValueChange={(itemValue: AvailableLanguages, itemIndex) => {
                        let newLanguage = DefaultLanguage;
                        newLanguage = itemValue;Heading
                        dispatch(useLanguage(newLanguage));
                    }}>
                    <Select.Item label='Français' value='fr'/>
                    <Select.Item label='English' value='en'/>
                    <Select.Item label='Italiano' value='it'/>
                    <Select.Item label='Espanol' value='sp'/>
                </Select>
            </View>

            <View style={{margin: 20, maxHeight: 100, maxWidth: 500, width: '80%'}}>
                <Select selectedValue={undefined}
                    placeholder={ translate('diffBtn') }
                    style={{ height: 50, width: 150, alignSelf: 'center'}}
                    // onValueChange={(itemValue, itemIndex) => change level}
                    >

                    <Select.Item label={ translate('easy') } value='easy'/>
                    <Select.Item label={ translate('medium') } value='medium'/>
                    <Select.Item label={ translate('hard') } value='hard'/>
                </Select>
            </View>

            <View style={{margin: 20}}>
                <Text style={{ textAlign: "center" }}>Color blind mode</Text>
                <Switch style={{ alignSelf: 'center'}} colorScheme="primary"/>
            </View>

            <View style={{margin: 20, maxHeight: 100, maxWidth: 500, width: '80%'}}>
                <Text style={{ textAlign: "center" }}>Mic volume</Text>
                <Slider defaultValue={50} minValue={0} maxValue={1000} accessibilityLabel="hello world" step={10}>
                    <Slider.Track>
                        <Slider.FilledTrack/>
                    </Slider.Track>
                    <Slider.Thumb/>
                </Slider>
            </View>

            <View style={{margin: 20, maxHeight: 100, maxWidth: 500, width: '80%'}}>
                <Select selectedValue={undefined}
                    placeholder={'Device'}
                    style={{ height: 50, width: 150, alignSelf: 'center'}}
                    // onValueChange={(itemValue, itemIndex) => change device}
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