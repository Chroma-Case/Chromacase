import React from "react";
import { View } from 'react-native';
import { Center, Button, Text, Switch, Heading } from "native-base";
import { translate } from "../../i18n/i18n";

const NotificationsView = ({navigation}) => {
    return (
        <Center style={{ flex: 1, justifyContent: 'center' }}>

            <Heading style={{ textAlign: "center" }}>{ translate('notifBtn')}</Heading>
            <Button variant='outline' style={{ margin: 10}} onPress={() => navigation.navigate('Settings')} >{ translate('backBtn') }</Button>

            <View style={{margin: 20}} >
                <Text style={{ textAlign: "center" }}>Push notifications</Text>
                <Switch style={{ alignSelf: 'center', margin: 10 }} colorScheme="primary"/>
            </View>

            <View style={{margin: 20}}>
                <Text style={{ textAlign: "center" }}>Email notifications</Text>
                <Switch style={{ alignSelf: 'center', margin: 10 }} colorScheme="primary"/>
            </View>

            <View style={{margin: 20}}>
                <Text style={{ textAlign: "center" }}>Training reminder</Text>
                <Switch style={{ alignSelf: 'center', margin: 10 }} colorScheme="primary"/>
            </View>

            <View style={{margin: 20}}>
                <Text style={{ textAlign: "center" }}>New songs</Text>
                <Switch style={{ alignSelf: 'center', margin: 10 }} colorScheme="primary"/>
            </View>
        </Center>
    )
}

export default NotificationsView;