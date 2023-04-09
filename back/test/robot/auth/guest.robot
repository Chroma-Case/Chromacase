*** Settings ***
Documentation       Tests of the /auth route.
...                 Ensures that the user can authenticate on kyoo.

Resource            ../rest.resource
Resource            ./auth.resource


*** Test Cases ***
LoginAsGuest
    [Documentation]    Login as a guest
    &{res}=    POST    /auth/guest
    Output
    Integer    response status    200
    String    response body access_token
    Set Headers    {"Authorization": "Bearer ${res.body.access_token}"}

    ${res}=    GET    /auth/me
    Output
    Integer    response status    200
    Boolean    response body isGuest    true
    Integer    response body partyPlayed    0

    [Teardown]    DELETE    /auth/me

TwoGuests
    [Documentation]    Login as a guest
    &{res}=    POST    /auth/guest
    Output
    Integer    response status    200
    String    response body access_token
    Set Headers    {"Authorization": "Bearer ${res.body.access_token}"}

    GET    /auth/me
    Output
    Integer    response status    200
    Boolean    response body isGuest    true
    Integer    response body partyPlayed    0

    &{res2}=    POST    /auth/guest
    Output
    Integer    response status    200
    String    response body access_token
    Set Headers    {"Authorization": "Bearer ${res2.body.access_token}"}

    GET    /auth/me
    Output
    Integer    response status    200
    Boolean    response body isGuest    true
    Integer    response body partyPlayed    0

    [Teardown]    Run Keywords    DELETE    /auth/me
    ...    AND    Set Headers    {"Authorization": "Bearer ${res.body.access_token}"}
    ...    AND    DELETE    /auth/me

GuestToNormal
    [Documentation]    Login as a guest and convert to a normal account
    &{res}=    POST    /auth/guest
    Output
    Integer    response status    200
    String    response body access_token
    Set Headers    {"Authorization": "Bearer ${res.body.access_token}"}

    ${res}=    GET    /auth/me
    Output
    Integer    response status    200
    Boolean    response body isGuest    true

    ${res}=    PUT    /auth/me    { "username": "toto", "password": "toto", "email": "a@b.c"}
    Output
    Integer    response status    200
    String    response body username    "toto"
    Boolean    response body isGuest    false

    [Teardown]    DELETE    /auth/me
