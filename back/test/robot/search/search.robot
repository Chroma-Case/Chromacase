# *** Settings ***
# Documentation       Tests of the /search route.
# ...                 Ensures that the search routes are working properly.

# Resource            ../rest.resource

# *** Test Cases ***
# Create artist and song
#     [Documentation]    Create everything to test a song search based on the artist
#     # Create the artist
#     &{resArtist}=    POST
#     ...    /artist
#     ...    {"name": "Powerwolf"}
#     Set Global Variable    ${resArtist}
#     Output
#     Integer    response status    201
#     # Create the song
#     &{resSong}=    POST
#     ...    /song
#     ...    {"name": "Sanctus Dominus", "difficulties": {}, "midiPath": "string", "musicXmlPath": "string", "artist":${resArtist.body.id}, "album": 0, "genre": 0}
#     Set Global Variable    ${resSong}
#     Output
#     Integer    response status    201



# Search for the song based on artist
#     [Documentation]    I'll dance dance with my hands hands above my head
#         # 
#     Log    message
#     &{get1}=    GET
#     ...    /search/artist/${resArtist.body.id}
#     Output
#     Integer    response status    200
#     Should Be Equal    ${get1.body.id}    ${resSong.body.id}
#     [Teardown]    DELETE    /artist/${resArtist.body.id}
#     DELETE    /song/${resSong.body.id}
