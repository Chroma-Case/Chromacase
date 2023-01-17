*** Settings ***
Documentation       Tests of the /search route.
...                 Ensures that the search routes are working properly.

Resource            ../rest.resource

*** Test Cases ***
Search for Artists
    [Documentation]    Create an artist
    &{res}=    POST
    ...    /artist
    ...    {"name": "Powerwolf"}
    Output
    Integer    response status    201
    &{get}=    GET    /search/artist/${res.body.id}
    Output
    Integer    response status    200
    Should Be Equal    ${get.body.name}    "Powerwolf"
    &{get2}=    GET    /search/guess/artist/Powerwolf
    Output
    Integer    response status    200
    Should Be Equal    ${get2.body.id}    ${res.body.id}
    [Teardown]    DELETE    /artist/${res.body.id}


