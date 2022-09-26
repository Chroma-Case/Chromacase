import React from "react";
import Col from "../../components/col";
import Row from "../../components/row";
import SongCard from "../../components/songCard";

const RecentlyPlayed = () => {
    return (
      <Col>
        <Row>
          <SongCard albumCover="https://e-cdn-images.dzcdn.net/images/artist/61bcbf8296b1669499064406c534d39d/264x264-000000-80-0-0.jpg"
                    songTitle="Stay foolish"
                    artistName="ZUTOMAYO"/>
          <SongCard albumCover="https://e-cdn-images.dzcdn.net/images/artist/61bcbf8296b1669499064406c534d39d/264x264-000000-80-0-0.jpg"
                    songTitle="Mirror tune"
                    artistName="ZUTOMAYO"/>
        </Row>
        <Row>
          <SongCard albumCover="https://e-cdn-images.dzcdn.net/images/artist/61bcbf8296b1669499064406c534d39d/264x264-000000-80-0-0.jpg"
                    songTitle="Neko reset"
                    artistName="ZUTOMAYO"/>
          <SongCard albumCover="https://e-cdn-images.dzcdn.net/images/artist/61bcbf8296b1669499064406c534d39d/264x264-000000-80-0-0.jpg"
                    songTitle="Milabo"
                    artistName="ZUTOMAYO"/>
        </Row>
      </Col>
    );
}

export default RecentlyPlayed;