*** Settings ***
Documentation       Tests of the /users route.
...                 Ensures that the users CRUD works corectly.

Resource            ../rest.resource


*** Test Cases ***
Create a user
    [Documentation]    Create a user
    &{res}=    POST    /users    {"username": "louis-boufon", "password": "pass", "email": "wow@gmail.com"}
    Output
    Integer    response status    201
    [Teardown]    DELETE    /users/${res.body.id}
