*** Settings ***
Documentation       Tests of the /lesson route.
...                 Ensures that the lesson CRUD works corectly.

Resource            ../rest.resource


*** Test Cases ***
Post a lesson
    [Documentation]    Get a lesson
    &{res}=    POST
    ...    /lesson
    ...    {"name": "toto", "requiredLevel": 3, "mainSkill": "TwoHands", "description": "What am i doing"}
    Output
    Integer    response status    201
    [Teardown]    DELETE    /lesson/${res.body.id}

Get a lesson
    [Documentation]    Get a lesson
    &{res}=    POST
    ...    /lesson
    ...    {"name": "toto", "requiredLevel": 3, "mainSkill": "TwoHands", "description": "What am i doing"}
    Output
    Integer    response status    201
    &{get}=    GET    /lesson/${res.body.id}
    Output
    Should Be Equal    ${res.body}    ${get.body}
    [Teardown]    DELETE    /lesson/${res.body.id}

Get a non-lesson
    [Documentation]    Get a lesson
    &{get}=    GET    /lesson/toto
    Output
    Integer    response status    400

Get a not-existing-lesson
    [Documentation]    Get a lesson
    &{get}=    GET    /lesson/99999999
    Output
    Integer    response status    404

Get all lessons
    [Documentation]    Get a lesson
    &{res}=    POST
    ...    /lesson
    ...    {"name": "toto", "requiredLevel": 3, "mainSkill": "TwoHands", "description": "What am i doing"}
    Output
    Integer    response status    201
    &{res2}=    POST
    ...    /lesson
    ...    {"name": "tata", "requiredLevel": 3, "mainSkill": "TwoHands", "description": "What am i doing"}
    Output
    Integer    response status    201
    &{get}=    GET    /lesson
    Output
    Should Contain    ${get.body.data}    ${res.body}
    Should Contain    ${get.body.data}    ${res2.body}

    [Teardown]    Run Keywords    DELETE    /lesson/${res.body.id}
    ...    AND    DELETE    /lesson/${res2.body.id}

Get all lessons filtered
    [Documentation]    Get a lesson
    &{res}=    POST
    ...    /lesson
    ...    {"name": "toto", "requiredLevel": 3, "mainSkill": "TwoHands", "description": "What am i doing"}
    Output
    Integer    response status    201
    &{res2}=    POST
    ...    /lesson
    ...    {"name": "tata", "requiredLevel": 3, "mainSkill": "Distance", "description": "What am i doing"}
    Output
    Integer    response status    201
    &{get}=    GET    /lesson?mainSkill=Distance
    Output
    Should Not Contain    ${get.body.data}    ${res.body}
    Should Contain    ${get.body.data}    ${res2.body}

    [Teardown]    Run Keywords    DELETE    /lesson/${res.body.id}
    ...    AND    DELETE    /lesson/${res2.body.id}
