import Model from "./Model";

interface SearchHistory extends Model {
    query: string;
    type: "song" | "artist" | "album" | "genre";
    timestamp: number;
}

export default SearchHistory;