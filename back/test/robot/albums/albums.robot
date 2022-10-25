*** Settings ***
Documentation       Tests of the /album route.
...                 Ensures that the album CRUD works corectly.

Resource            ../rest.resource


*** Test Cases ***
Create a album
    [Documentation]    Create a album
    &{res}=    POST
    ...    /album
    ...    {"name": "Mama mia"}
    Output
    Integer    response status    201
    [Teardown]    DELETE    /album/${res.body.id}

Create a album with an artist
    [Documentation]    Create a album with an artist
    &{artistRes}=    POST
    ...    /artist
    ...    {"name": "Mama mia"}

    
    &{res}=    POST
    ...    /album
    ...    {"name": "Mama mia", "artist": ${artistRes.body.id}}
    Output
    Integer    response status    201
    [Teardown]    Run Keywords    DELETE    /artist/${artistRes.body.id}
    ...    AND    DELETE    /album/${res.body.id}


Duplicate a album
    [Documentation]    Duplicate a album
    &{res}=    POST
    ...    /album
    ...    {"name": "Mama mia"}
    Output
    Integer    response status    201
    &{res2}=    POST
    ...    /album
    ...    {"name": "Mama mia"}
    Output
    Integer    response status    409
	Should Be Equal    ${res.body.id}    ${res2.body.id}
    [Teardown]    DELETE    /album/${res.body.id}

Find a album
    [Documentation]    Create a album and find it
    &{res}=    POST
    ...    /album
    ...    {"name": "Mama mia"}
    Output
    Integer    response status    201
    &{get}=    GET    /album/${res.body.id}
    Output
    Integer    response status    200
    Should Be Equal    ${res.body}    ${get.body}
    [Teardown]    DELETE    /album/${res.body.id}

Find a album non existant
    [Documentation]    Find non existant album
    &{get}=    GET    /album/9999
    Integer    response status    404

Find multiples albums
    [Documentation]    Create two albums and find them
    &{res}=    POST
    ...    /album
    ...    {"name": "Mama mia"}
    Output
    Integer    response status    201
    &{res2}=    POST
    ...    /album
    ...    {"name": "Toto"}

    Output
    Integer    response status    201

    &{get}=    GET    /album
    Output
    Integer    response status    200
    Should Contain    ${get.body.data}    ${res.body}
    Should Contain    ${get.body.data}    ${res2.body}
    [Teardown]    Run Keywords    DELETE    /album/${res.body.id}
    ...    AND    DELETE    /album/${res2.body.id}

Find multiples albums filtered
    [Documentation]    Create two albums and find them
    &{res}=    POST
    ...    /album
    ...    {"name": "Mamamia"}
    Output
    Integer    response status    201
    &{res2}=    POST
    ...    /album
    ...    {"name": "jkgnsg"}
    Output
    Integer    response status    201

    &{get}=    GET    /album?name=Mamamia
    Output
    Integer    response status    200
    Should Contain    ${get.body.data}    ${res.body}
    Should Not Contain    ${get.body.data}    ${res2.body}
    [Teardown]    Run Keywords    DELETE    /album/${res.body.id}
    ...    AND    DELETE    /album/${res2.body.id}

Find multiples albums filtered by type
    [Documentation]    Create two albums and find them
    &{res}=    POST
    ...    /album
    ...    {"name": "Mama mia"}
    Output
    Integer    response status    201
    &{res2}=    POST
    ...    /album
    ...    {"name": "kldngsd"}
    Output
    Integer    response status    201

    &{get}=    GET    /album?id=${res.body.id}
    Output
    Integer    response status    200
    Should Contain    ${get.body.data}    ${res.body}
    Should Not Contain    ${get.body.data}    ${res2.body}
    [Teardown]    Run Keywords    DELETE    /album/${res.body.id}
    ...    AND    DELETE    /album/${res2.body.id}
