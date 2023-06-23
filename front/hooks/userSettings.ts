import { useQuery } from '../Queries';
import API from '../API';

const useUserSettings = () => {
	const settings = useQuery(API.getUserSettings);
	const updateSettings = (...params: Parameters<typeof API.updateUserSettings>) =>
		API.updateUserSettings(...params).then(() => settings.refetch());
	return { settings, updateSettings };
};

export default useUserSettings;
