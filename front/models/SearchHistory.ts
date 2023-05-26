import Model from "./Model";

interface SearchHistory extends Model {
    query: string;
    type: "song" | "artist" | "album" | "genre";
    userId: number;
    timestamp: Date;
}

export default SearchHistory;