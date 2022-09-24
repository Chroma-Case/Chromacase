*** Settings ***
Documentation       Tests of the /users route.
...                 Ensures that the users CRUD works corectly.
Resource            ../rest.resource


*** Keywords ***
*** Test Cases ***
Create a user
    [Documentation]    Create a user
    POST    /users    {"username": "i-don-t-exist", "password": "pass", "email": "wow@gmail.com"}
    Output
    Integer    response status    201
	[Teardown]    DELETE    /users/1