import { useMutation, useQueryClient } from "react-query"
import API from "../API";

/**
 * Mutation to like/unlike a song
 */
export const useLikeSongMutation = () => {
	const queryClient = useQueryClient();

	return useMutation(({ songId, like }: {songId: number, like: boolean}) => {
		const apiCall = like ? API.addLikedSong : API.removeLikedSong
		
		return apiCall(songId).then(() => {
			queryClient.invalidateQueries('liked songs')
			queryClient.invalidateQueries('songs')
			queryClient.invalidateQueries([songId])
		});
	});
}