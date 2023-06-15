import { useQuery } from 'react-query';
import API from '../API';

const useUserSettings = () => {
	const queryKey = ['settings'];
	const settings = useQuery(queryKey, () => API.getUserSettings());
	const updateSettings = (...params: Parameters<typeof API.updateUserSettings>) =>
		API.updateUserSettings(...params).then(() => settings.refetch());
	return { settings, updateSettings };
};

export default useUserSettings;
