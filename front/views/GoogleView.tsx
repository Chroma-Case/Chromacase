import { useEffect } from "react"
import { useDispatch } from "react-redux";
import API, { AccessToken } from "../API";
import { setAccessToken } from "../state/UserSlice";

const GoogleView = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		async function run() {
			const accessToken = await API.fetch({
				route: `/auth/logged/google${window.location.search}`,
				method: 'GET',
			}).then((responseBody) => responseBody.access_token as AccessToken)
			dispatch(setAccessToken(accessToken))
		}
		run();
	}, []);

	return <p>Loading please wait</p>;
}

export default GoogleView;
