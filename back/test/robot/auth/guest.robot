*** Settings ***
Documentation       Tests of the /auth route.
...                 Ensures that the user can authenticate on kyoo.

Resource            ../rest.resource
Resource            ./auth.resource


*** Test Cases ***
LoginAsGuest
    [Documentation]    Login as a guest
    &{res}=    POST    /auth/guest {"username": "i-am-a-guest"}
    Output
    Integer    response status    200
    String    response body access_token
    Set Headers    {"Authorization": "Bearer ${res.body.access_token}"}

    ${res}=    GET    /auth/me
    Output
    Integer    response status    200
    Boolean    response body isGuest    true
    Integer    response body partyPlayed    0
    String    response body username    "i-am-a-guest"

    [Teardown]    DELETE    /auth/me

TwoGuests
    [Documentation]    Login as a guest
    &{res}=    POST    /auth/guest {"username": "i-am-another-guest"}
    Output
    Integer    response status    200
    String    response body access_token
    Set Headers    {"Authorization": "Bearer ${res.body.access_token}"}

    GET    /auth/me
    Output
    Integer    response status    200
    Boolean    response body isGuest    true
    Integer    response body partyPlayed    0
    String    response body username    "i-am-another-guest"

    &{res2}=    POST    /auth/guest {"username": "i-am-a-third-guest"}
    Output
    Integer    response status    200
    String    response body access_token
    Set Headers    {"Authorization": "Bearer ${res2.body.access_token}"}

    GET    /auth/me
    Output
    Integer    response status    200
    Boolean    response body isGuest    true
    Integer    response body partyPlayed    0
    String    response body username    "i-am-a-third-guest"

    [Teardown]    Run Keywords    DELETE    /auth/me
    ...    AND    Set Headers    {"Authorization": "Bearer ${res.body.access_token}"}
    ...    AND    DELETE    /auth/me

GuestToNormal
    [Documentation]    Login as a guest and convert to a normal account
    &{res}=    POST    /auth/guest {"username": "i-will-be-a-real-user"}
    Output
    Integer    response status    200
    String    response body access_token
    Set Headers    {"Authorization": "Bearer ${res.body.access_token}"}

    ${res}=    GET    /auth/me
    Output
    Integer    response status    200
    Boolean    response body isGuest    true
    String    response body username    "i-will-be-a-real-user"

    ${res}=    PUT    /auth/me    { "password": "toto", "email": "awdaw@b.c"}
    Output
    Integer    response status    200
    String    response body username    "toto"
    Boolean    response body isGuest    false
    String    response body username    "i-will-be-a-real-user"

    [Teardown]    DELETE    /auth/me
