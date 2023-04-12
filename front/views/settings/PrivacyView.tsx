import React from "react";
import { View } from 'react-native';
import { Center, Button, Text, Switch, Heading } from "native-base";
import { translate } from "../../i18n/i18n";

const PrivacyView = ({navigation}) => {
    return (
        <Center style={{ flex: 1}}>
            <Heading style={{ textAlign: "center" }}>{ translate('privBtn')}</Heading>

            <Button variant='outline' onPress={() => navigation.navigate('Settings')} style={{ margin: 10 }}>{ translate('backBtn') }</Button>

            <View style={{margin: 20}} >
                <Text style={{ textAlign: "center" }}>Data Collection</Text>
                <Switch style={{ alignSelf: 'center', margin: 10 }} colorScheme="primary"/>
            </View>

            <View style={{margin: 20}}>
                <Text style={{ textAlign: "center" }}>Custom Adds</Text>
                <Switch style={{ alignSelf: 'center', margin: 10 }} colorScheme="primary"/>
            </View>

            <View style={{margin: 20}}>
                <Text style={{ textAlign: "center" }}>Recommendations</Text>
                <Switch style={{ alignSelf: 'center', margin: 10 }} colorScheme="primary"/>
            </View>
        </Center>
    )
}

export default PrivacyView;