*** Settings ***
Documentation    Tests of the /song route.
...              Ensures that the songs CRUD works corectly.
Resource         ../rest.resource


*** Keywords ***
*** Test Cases ***
Create a song
    [Documentation]    Create a song
    &{res}=            POST                    /song    {"name": "Mama mia", "difficulties": {}}
    Output
    Integer            response status         201
	[Teardown]    DELETE             /song/${res.body.id}

Find a song
    [Documentation]    Create a song and find it
    &{res}=            POST                         /song                   {"name": "Mama mia", "difficulties": {}}
    Output
    Integer            response status              201
	&{get}=            GET                          /song/${res.body.id}
    Output
    Integer            response status              200
    Should Be Equal    ${res.body}                       ${get.body}
    [Teardown]         DELETE                       /song/${res.body.id}


Find a song non existant
    [Documentation]    Find non existant song
    &{get}=            GET                          /song/9999
    Integer            response status              404

Find multiples songs
    [Documentation]    Create two songs and find them
    &{res}=            POST                         /song                   {"name": "Mama mia", "difficulties": {}}
    Output
    Integer            response status              201
	&{res2}=           POST                         /song                   {"name": "Here we go again", "difficulties": {}}
    Output
    Integer            response status              201

    &{get}=            GET                          /song
    Output
    Integer            response status              200
    Should Contain     ${get.body.data}              ${res.body}
    Should Contain     ${get.body.data}              ${res2.body}
    [Teardown]         Run Keywords    DELETE                       /song/${res.body.id}
    ...    AND                         DELETE                       /song/${res2.body.id}

Find multiples songs filtered
    [Documentation]    Create two songs and find them
    &{res}=            POST                         /song                   {"name": "Mamamia", "difficulties": {}}
    Output
    Integer            response status              201
	&{res2}=           POST                         /song                   {"name": "Here we go again", "difficulties": {}}
    Output
    Integer            response status              201

    &{get}=            GET                          /song?name=Mamamia
    Output
    Integer            response status              200
    Should Contain     ${get.body.data}              ${res.body}
    Should Not Contain     ${get.body.data}              ${res2.body}
    [Teardown]         Run Keywords    DELETE                       /song/${res.body.id}
    ...    AND                         DELETE                       /song/${res2.body.id}



Find multiples songs filtered by type
    [Documentation]    Create two songs and find them
    &{res}=            POST                         /song                   {"name": "Mamamia", "difficulties": {}}
    Output
    Integer            response status              201
	&{res2}=           POST                         /song                   {"name": "Here we go again", "difficulties": {}}
    Output
    Integer            response status              201

    &{get}=            GET                          /song?id=${res.body.id}
    Output
    Integer            response status              200
    Should Contain     ${get.body.data}              ${res.body}
    Should Not Contain     ${get.body.data}              ${res2.body}
    [Teardown]         Run Keywords    DELETE                       /song/${res.body.id}
    ...    AND                         DELETE                       /song/${res2.body.id}