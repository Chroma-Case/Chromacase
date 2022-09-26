import React from "react";
import { Card, Text, Title } from "react-native-paper";

const SongCard = (
    props: { 
        albumCover: string; 
        songTitle: string; 
        artistName: string;
    }) =>
{

    const { albumCover, songTitle, artistName } = props

    const cardFormat = {
        margin: 10,
        padding: 5,
        width: 200,
        backgroundColor: '#C5C5C5'
    }

    const artistNameStyle = {
        fontStyle: 'Italic'
    }

    const songTitleStyle = {
        fontSize: 17,
        color: 'black'
    }

    const coverImageStyle = {
        height: 150,
        width: 190
    }

    return (
        <Card style={cardFormat}>
          <Card.Cover source={{ uri: albumCover }} style={coverImageStyle}/>
          <Card.Content>
            <Title style={songTitleStyle}> 
                {songTitle}
            </Title>
            <Text style={artistNameStyle}> 
                {artistName}
            </Text>
          </Card.Content>
        </Card>
    );
}

export default SongCard;