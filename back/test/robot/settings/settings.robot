*** Settings ***
Documentation       Tests of the /settings route.
...                 Ensures that the settings CRUD works corectly as well as the automation with the user creation.

Resource            ../rest.resource


*** Test Cases ***
Get settings
    [Documentation]    Create a user and get associated settings
    &{user}=    POST    /users    {"username": "3li", "password": "bassuard", "email": "3li@gmail.com"}
    Output
    Integer    response status    201
    &{get}=    GET    /settings/${user.body.id}
    Output
    Should Be True    ${get.body.emailNotification}
    Integer    response status    200
    [Teardown]    DELETE    /users/${user.body.id}

Patch settingspushNotification
    &{user}=    POST    /users    {"username": "3li", "password": "bassuard", "email": "3li@gmail.com"}
    Output
    Integer    response status    201
    &{patch}=    PATCH
    ...    /settings/${user.body.id}
    ...    {"pushNotification": true, "emailNotification": true, "trainingNotification": true, "newSongNotification": true, "recommendations": true, "weeklyReport": true, "leaderBoard": false, "showActivity": true}
    Output
    Should Not Be True    ${patch.body.leaderBoard}
    Integer    response status    200
    [Teardown]    DELETE    /users/${user.body.id}
