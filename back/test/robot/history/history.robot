*** Settings ***
Documentation       Tests of the /history route.
...                 Ensures that the history CRUD works corectly.

Resource            ../rest.resource
Resource            ../auth/auth.resource


*** Test Cases ***
Get history without behing connected
    &{history}=    GET    /history
    Output
    Integer    response status    401

Create and get an history record
    [Documentation]    Create an history item
    &{song}=    POST
    ...    /song
    ...    {"name": "Mama mia", "difficulties": {}, "midiPath": "/musics/Beethoven-125-4.midi", "musicXmlPath": "/musics/Beethoven-125-4.mxl"}
    Output
    ${userID}=    RegisterLogin    wowuser

    &{history}=    POST
    ...    /history
    ...    { "userID": ${userID}, "songID": ${song.body.id}, "score": 55, "difficulties": {} }
    Output
    Integer    response status    201

    &{res}=    GET    /history
    Output
    Integer    response status    200
    Array    response body
    Integer    $[0].userID    ${userID}
    Integer    $[0].songID    ${song.body.id}
    Integer    $[0].score    55

    [Teardown]    Run Keywords    DELETE    /users/${userID}
    ...    AND    DELETE    /song/${song.body.id}

Create and get a duplicated history record
    [Documentation]    Create an history item
    &{song}=    POST
    ...    /song
    ...    {"name": "Mama mia", "difficulties": {}, "midiPath": "/musics/Beethoven-125-4.midi", "musicXmlPath": "/musics/Beethoven-125-4.mxl"}
    Output
    ${userID}=    RegisterLogin    wowuser

    &{history}=    POST
    ...    /history
    ...    { "userID": ${userID}, "songID": ${song.body.id}, "score": 55, "difficulties": {} }
    Output
    Integer    response status    201

    &{history2}=    POST
    ...    /history
    ...    { "userID": ${userID}, "songID": ${song.body.id}, "score": 65, "difficulties": {} }
    Output
    Integer    response status    201

    &{res}=    GET    /history
    Output
    Integer    response status    200
    Array    response body
    Integer    $[0].userID    ${userID}
    Integer    $[0].songID    ${song.body.id}
    Integer    $[0].score    65
    Integer    $[1].userID    ${userID}
    Integer    $[1].songID    ${song.body.id}
    Integer    $[1].score    55

    [Teardown]    Run Keywords    DELETE    /users/${userID}
    ...    AND    DELETE    /song/${song.body.id}

Create and get a search history record
    [Documentation]    Create a search history item
    ${userID}=    RegisterLogin    historyqueryuser

    GET    /search/song/toto
    Output
    Integer    response status    404

    GET    /search/song/tata
    Output
    Integer    response status    404

    &{res}=    GET    /history/search
    Output
    Integer    response status    200
    Array    response body
    String    $[0].type    "song"
    String    $[0].query    "tata"
    String    $[1].type    "song"
    String    $[1].query    "toto"

    [Teardown]    DELETE    /users/${userID}

Get the history of a single song
    [Documentation]    Create an history item
    &{song}=    POST
    ...    /song
    ...    {"name": "Mama mia", "difficulties": {}, "midiPath": "/musics/Beethoven-125-4.midi", "musicXmlPath": "/musics/Beethoven-125-4.mxl"}
    Output
    &{song2}=    POST
    ...    /song
    ...    {"name": "Mama mia2", "difficulties": {}, "midiPath": "/musics/Beethoven-125-42.midi", "musicXmlPath": "/musics/Beethoven-125-24.mxl"}
    Output
    ${userID}=    RegisterLogin    wowuser

    &{history}=    POST
    ...    /history
    ...    { "userID": ${userID}, "songID": ${song.body.id}, "score": 55, "difficulties": {} }
    Output
    Integer    response status    201
    &{history2}=    POST
    ...    /history
    ...    { "userID": ${userID}, "songID": ${song.body.id}, "score": 65, "difficulties": {} }
    Output
    Integer    response status    201
    &{history3}=    POST
    ...    /history
    ...    { "userID": ${userID}, "songID": ${song2.body.id}, "score": 75, "difficulties": {} }
    Output
    Integer    response status    201

    &{res}=    GET    /song/${song.body.id}/history
    Output
    Integer    response status    200
    Array    response body history
    Integer    $.history[0].userID    ${userID}
    Integer    $.history[0].songID    ${song.body.id}
    Integer    $.history[0].score    65
    Integer    $.history[1].userID    ${userID}
    Integer    $.history[1].songID    ${song.body.id}
    Integer    $.history[1].score    55
    Integer    $.best    65

    [Teardown]    Run Keywords    DELETE    /users/${userID}
    ...    AND    DELETE    /song/${song.body.id}
    ...    AND    DELETE    /song/${song2.body.id}
