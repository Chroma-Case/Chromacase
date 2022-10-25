*** Settings ***
Documentation       Tests of the /genre route.
...                 Ensures that the genre CRUD works corectly.

Resource            ../rest.resource


*** Test Cases ***
Create a genre
    [Documentation]    Create a genre
    &{res}=    POST
    ...    /genre
    ...    {"name": "Mama mia"}
    Output
    Integer    response status    201
    [Teardown]    DELETE    /genre/${res.body.id}

Duplicate a genre
    [Documentation]    Duplicate a genre
    &{res}=    POST
    ...    /genre
    ...    {"name": "Mama mia"}
    Output
    Integer    response status    201
    &{res2}=    POST
    ...    /genre
    ...    {"name": "Mama mia"}
    Output
    Integer    response status    409
	Should Be Equal    ${res.body.id}    ${res2.body.id}
    [Teardown]    DELETE    /genre/${res.body.id}

Find a genre
    [Documentation]    Create a genre and find it
    &{res}=    POST
    ...    /genre
    ...    {"name": "Mama mia"}
    Output
    Integer    response status    201
    &{get}=    GET    /genre/${res.body.id}
    Output
    Integer    response status    200
    Should Be Equal    ${res.body}    ${get.body}
    [Teardown]    DELETE    /genre/${res.body.id}

Find a genre non existant
    [Documentation]    Find non existant genre
    &{get}=    GET    /genre/9999
    Integer    response status    404

Find multiples genres
    [Documentation]    Create two genres and find them
    &{res}=    POST
    ...    /genre
    ...    {"name": "Mama mia"}
    Output
    Integer    response status    201
    &{res2}=    POST
    ...    /genre
    ...    {"name": "Toto"}

    Output
    Integer    response status    201

    &{get}=    GET    /genre
    Output
    Integer    response status    200
    Should Contain    ${get.body.data}    ${res.body}
    Should Contain    ${get.body.data}    ${res2.body}
    [Teardown]    Run Keywords    DELETE    /genre/${res.body.id}
    ...    AND    DELETE    /genre/${res2.body.id}

Find multiples genres filtered
    [Documentation]    Create two genres and find them
    &{res}=    POST
    ...    /genre
    ...    {"name": "Mamamia"}
    Output
    Integer    response status    201
    &{res2}=    POST
    ...    /genre
    ...    {"name": "jkgnsg"}
    Output
    Integer    response status    201

    &{get}=    GET    /genre?name=Mamamia
    Output
    Integer    response status    200
    Should Contain    ${get.body.data}    ${res.body}
    Should Not Contain    ${get.body.data}    ${res2.body}
    [Teardown]    Run Keywords    DELETE    /genre/${res.body.id}
    ...    AND    DELETE    /genre/${res2.body.id}

Find multiples genres filtered by type
    [Documentation]    Create two genres and find them
    &{res}=    POST
    ...    /genre
    ...    {"name": "Mama mia"}
    Output
    Integer    response status    201
    &{res2}=    POST
    ...    /genre
    ...    {"name": "kldngsd"}
    Output
    Integer    response status    201

    &{get}=    GET    /genre?id=${res.body.id}
    Output
    Integer    response status    200
    Should Contain    ${get.body.data}    ${res.body}
    Should Not Contain    ${get.body.data}    ${res2.body}
    [Teardown]    Run Keywords    DELETE    /genre/${res.body.id}
    ...    AND    DELETE    /genre/${res2.body.id}
