import { useMutation, useQueryClient } from 'react-query';
import API from '../API';

/**
 * Mutation to like/unlike a song
 */
export const useLikeSongMutation = () => {
	const queryClient = useQueryClient();

	return useMutation(({ songId, like }: { songId: number; like: boolean }) => {
		const apiCall = like ? API.addLikedSong : API.removeLikedSong;

		return apiCall(songId).then(() => {
			queryClient.invalidateQueries({ queryKey: ['liked songs'] });
			queryClient.invalidateQueries({ queryKey: ['songs'] });
			queryClient.invalidateQueries({ queryKey: [songId] });
		});
	});
};
