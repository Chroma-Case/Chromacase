*** Settings ***
Documentation       Tests of the /artist route.
...                 Ensures that the artist CRUD works corectly.

Resource            ../rest.resource


*** Test Cases ***
Create a artist
    [Documentation]    Create a artist
    &{res}=    POST
    ...    /artist
    ...    {"name": "Mama mia"}
    Output
    Integer    response status    201
    [Teardown]    DELETE    /artist/${res.body.id}

Duplicate a artist
    [Documentation]    Duplicate a artist
    &{res}=    POST
    ...    /artist
    ...    {"name": "Mama mia"}
    Output
    Integer    response status    201
    &{res2}=    POST
    ...    /artist
    ...    {"name": "Mama mia"}
    Output
    Integer    response status    409
	Should Be Equal    ${res.body.id}    ${res2.body.id}
    [Teardown]    DELETE    /artist/${res.body.id}

Find a artist
    [Documentation]    Create a artist and find it
    &{res}=    POST
    ...    /artist
    ...    {"name": "Mama mia"}
    Output
    Integer    response status    201
    &{get}=    GET    /artist/${res.body.id}
    Output
    Integer    response status    200
    Should Be Equal    ${res.body}    ${get.body}
    [Teardown]    DELETE    /artist/${res.body.id}

Find a artist non existant
    [Documentation]    Find non existant artist
    &{get}=    GET    /artist/9999
    Integer    response status    404

Find multiples artists
    [Documentation]    Create two artists and find them
    &{res}=    POST
    ...    /artist
    ...    {"name": "Mama mia"}
    Output
    Integer    response status    201
    &{res2}=    POST
    ...    /artist
    ...    {"name": "Toto"}

    Output
    Integer    response status    201

    &{get}=    GET    /artist
    Output
    Integer    response status    200
    Should Contain    ${get.body.data}    ${res.body}
    Should Contain    ${get.body.data}    ${res2.body}
    [Teardown]    Run Keywords    DELETE    /artist/${res.body.id}
    ...    AND    DELETE    /artist/${res2.body.id}

Find multiples artists filtered
    [Documentation]    Create two artists and find them
    &{res}=    POST
    ...    /artist
    ...    {"name": "Mamamia"}
    Output
    Integer    response status    201
    &{res2}=    POST
    ...    /artist
    ...    {"name": "jkgnsg"}
    Output
    Integer    response status    201

    &{get}=    GET    /artist?name=Mamamia
    Output
    Integer    response status    200
    Should Contain    ${get.body.data}    ${res.body}
    Should Not Contain    ${get.body.data}    ${res2.body}
    [Teardown]    Run Keywords    DELETE    /artist/${res.body.id}
    ...    AND    DELETE    /artist/${res2.body.id}

Find multiples artists filtered by type
    [Documentation]    Create two artists and find them
    &{res}=    POST
    ...    /artist
    ...    {"name": "Mama mia"}
    Output
    Integer    response status    201
    &{res2}=    POST
    ...    /artist
    ...    {"name": "kldngsd"}
    Output
    Integer    response status    201

    &{get}=    GET    /artist?id=${res.body.id}
    Output
    Integer    response status    200
    Should Contain    ${get.body.data}    ${res.body}
    Should Not Contain    ${get.body.data}    ${res2.body}
    [Teardown]    Run Keywords    DELETE    /artist/${res.body.id}
    ...    AND    DELETE    /artist/${res2.body.id}
