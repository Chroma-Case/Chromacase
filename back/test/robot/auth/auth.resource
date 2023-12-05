*** Settings ***
Documentation       Methods to login/register.

Resource            ../rest.resource


*** Keywords ***
ApiKey
    [Documentation]    Set the API Key
    Set Headers    {"Authorization": "API Key %{API_KEY_ROBOT}"}


Login
    [Documentation]    Shortcut to login with the given username for future requests
    [Arguments]    ${username}
    &{res}=    POST    /auth/login    {"username": "${username}", "password": "password-${username}"}
    Output
    Integer    response status    200
    String    response body access_token
    Set Headers    {"Authorization": "Bearer ${res.body.access_token}"}

Register
    [Documentation]    Shortcut to register with the given username for future requests
    [Arguments]    ${username}
    &{res}=    POST
    ...    /auth/register
    ...    {"username": "${username}", "password": "password-${username}", "email": "${username}@chromacase.moe"}
    Output
    Integer    response status    201

RegisterLogin
    [Documentation]    Shortcut to register with the given username for future requests
    [Arguments]    ${username}
    POST
    ...    /auth/register
    ...    {"username": "${username}", "password": "password-${username}", "email": "${username}@chromacase.moe"}
    Output
    Integer    response status    201
    &{res}=    POST    /auth/login    {"username": "${username}", "password": "password-${username}"}
    Output
    Integer    response status    200
    String    response body access_token
    Set Headers    {"Authorization": "Bearer ${res.body.access_token}"}

    &{me}=    GET    /auth/me
    Output
    Integer    response status    200
    RETURN    ${me.body.id}

Logout
    [Documentation]    Logout the current user, only the local client is affected.
    Set Headers    {"Authorization": ""}
