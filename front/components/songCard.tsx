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
        padding: 10,
        width: 300,
        backgroundColor: '#C5C5C5'
    }

    const artistNameStyle = {
        fontStyle: 'Italic'
    }

    const songTitleStyle = {
        fontweight: '900',
        color: 'black'
    }

    return (
        <Card style={cardFormat}>
          <Card.Cover source={{ uri: albumCover }} />
          <Card.Content>
          <Title style={songTitleStyle}> {songTitle}</Title>
            <Text style={artistNameStyle}> {artistName}</Text>
          </Card.Content>
        </Card>
    );
}

export default SongCard;