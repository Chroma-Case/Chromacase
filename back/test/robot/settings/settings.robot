*** Settings ***
Documentation       Tests of the /settings route.
...                 Ensures that the settings CRUD works corectly as well as the automation with the user creation.

Resource            ../rest.resource
Resource            ../auth/auth.resource


*** Test Cases ***
Get settings
    [Documentation]    Create a user and get associated settings
    ${userID}=    RegisterLogin    2na-min-faranssa-wa-2na-adrus-allu3'at-al3rabia
    &{get}=    GET    /auth/me/settings/
    Output
    Should Be True    ${get.body.emailNotification}
    Integer    response status    200
    [Teardown]    DELETE    /users/${userID}

Patch settingspushNotification
    ${userID}=    RegisterLogin    2na-min-faranssa-wa-2na-adrus-allu3'at-al3rabia
    &{patch}=    PATCH
    ...    /auth/me/settings/
    ...    {"pushNotification": true, "emailNotification": true, "trainingNotification": true, "newSongNotification": true, "recommendations": true, "weeklyReport": true, "leaderBoard": false, "showActivity": true}
    Output
    Should Not Be True    ${patch.body.leaderBoard}
    Integer    response status    200
    [Teardown]    DELETE    /users/${userID}
