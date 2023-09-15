*** Settings ***
Documentation       Tests of the /auth route.
...                 Ensures that the user can authenticate on kyoo.

Resource            ../rest.resource
Resource            ./auth.resource


*** Test Cases ***
Me cant be accessed without an account
    Get    /auth/me
    Output
    Integer    response status    401

Bad Account
    [Documentation]    Login fails if user does not exist
    POST    /auth/login    {"username": "i-don-t-exist", "password": "pass"}
    Output
    Integer    response status    401

RegisterAndLogin
    [Documentation]    Create a new user and login in it
    Register    user-1
    Login    user-1
    [Teardown]    DELETE    /auth/me

Register Duplicates
    [Documentation]    If two users tries to register with the same username, it fails
    Register    user-duplicate
    # We can't use the `Register` keyword because it assert for success
    POST    /auth/register    {"username": "user-duplicate", "password": "pass", "email": "mail@kyoo.moe"}
    Output
    Integer    response status    422
    Login    user-duplicate
    [Teardown]    DELETE    /auth/me

Delete Account
    [Documentation]    Check if a user can delete it's account
    Register    I-should-be-deleted
    Login    I-should-be-deleted
    DELETE    /auth/me
    Output
    Integer    response status    200

Login
    [Documentation]    Create a new user and login in it
    Register    login-user
    Login    login-user
    ${res}=    GET    /auth/me
    Output
    Integer    response status    200
    String    response body username    login-user

    Logout
    Login    login-user
    ${me}=    Get    /auth/me
    Output
    Output    ${me}
    Should Be Equal As Strings    ${res["body"]}    ${me["body"]}

    [Teardown]    DELETE    /auth/me
