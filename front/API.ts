import Artist from "./models/Artist";
import AuthToken from "./models/AuthToken";
import Chapter from "./models/Chapter";
import Lesson from "./models/Lesson";
import LessonHistory from "./models/LessonHistory";
import Song from "./models/Song";
import SongHistory from "./models/SongHistory";
import User from "./models/User";
import Constants from 'expo-constants';
import store from "./state/Store";

type AuthenticationInput = { username: string, password: string };
type RegistrationInput = AuthenticationInput & { email: string };
export type AccessToken = string;

type FetchParams = {
	route: string;
	body?: Object;
	method?: 'GET' | 'POST' | 'DELETE'
}

const dummyIllustration = "https://i.discogs.com/syRCX8NaLwK2SMk8X6TVU_DWc8RRqE4b-tebAQ6kVH4/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTgyNTQz/OC0xNjE3ODE0NDI2/LTU1MjUuanBlZw.jpeg";

export default class API {

	private static async fetch(params: FetchParams) {
		const jwtToken = store.getState().user.accessToken;
		const header = {
			'Content-Type': 'application/json'
		}
		const response = await fetch(`${Constants.manifest?.extra?.apiUrl}${params.route}`, {
			headers: jwtToken && { ...header, 'Authorization': `Bearer ${jwtToken}` } || header,
			body: JSON.stringify(params.body),
			method: params.method ?? 'GET' 
		});
		const body = await response.text();

		try {
			const jsonResponse = body.length != 0 ? JSON.parse(body) : {};
			if (!response.ok) {
				throw new Error(jsonResponse.error ?? response.statusText)
			}
			return jsonResponse;
		} catch (e) {
			if (e instanceof SyntaxError)
				throw new Error("Error while parsing Server's response");
			throw e;
		}
	}

	public static async authenticate(authenticationInput: AuthenticationInput): Promise<AccessToken> {
		return API.fetch({
			route: '/auth/login',
			body: authenticationInput,
			method: 'POST'
		}).then((responseBody) => responseBody.access_token)
	}
	/**
	 * Create a new user profile, with an email and a password
	 * @param registrationInput the credentials to create a new profile
	 * @returns A Promise. On success, will be resolved into an instance of the API wrapper
	 */
	public static async createAccount(registrationInput: RegistrationInput): Promise<AccessToken> {
		await API.fetch({
			route: '/auth/register',
			body: registrationInput,
			method: 'POST'
		});
		return API.authenticate({ username: registrationInput.username, password: registrationInput.password });
	}

	/***
	 * Retrieve information of the currently authentified user
	 */
	public static async getUserInfo(): Promise<User> {
		return API.fetch({
			route: '/auth/me'
		});
	}

	public static async getUserSkills() {
		return {
			pedalsCompetency: Math.random() * 100,
			rightHandCompetency: Math.random() * 100,
			leftHandCompetency:	Math.random() * 100,
			accuracyCompetency:	Math.random() * 100,
			arpegeCompetency: Math.random() * 100,
			chordsCompetency: Math.random() * 100,
		}
	}

	/**
	 * Authentify a new user through Google
	 */
	public static async authWithGoogle(): Promise<AuthToken> {
		//TODO
		return "11111";
	}

	/**
	 * Retrive a song
	 * @param songId the id to find the song
	 */
	public static async getSong(songId: number): Promise<Song> {
		return API.fetch({
			route: `/song/${songId}`
		});
	}

	/**
	 * Retrive an artist
	 */
	public static async getArtist(artistId: number): Promise<Artist> {
		return API.fetch({
			route: `/artist/${artistId}`
		});
	}


	/**
	 * Retrive a song's chapters
	 * @param songId the id to find the song
	 */
	public static async getSongChapters(songId: number): Promise<Chapter[]> {
		return [1, 2, 3, 4, 5].map((value) => ({
			start: 100 * (value - 1),
			end: 100 * value,
			songId: songId,
			name: `Chapter ${value}`,
			type: "chorus",
			key_aspect: "rhythm",
			difficulty: value,
			id: value * 10
		}));
	}

	/**
	 * Retrieve a song's play history
	 * @param songId the id to find the song
	 */
	public static async getSongHistory(songId: number): Promise<SongHistory[]> {
		return [6, 1, 2, 3, 4, 5].map((value) => ({
			songId: songId,
			userId: 1,
			score: value
		}));
	}

	/**
	 * Search a song by its name
	 * @param query the string used to find the songs
	 */
	 public static async searchSongs(query: string): Promise<Song[]> {
		return Array.of(4).map((i) => ({
			id: i,
			name: `Searched Song ${i}`,
			artistId: i,
			genreId: i,
			albumId: i,
			cover: dummyIllustration,
			metrics: {}
		}));
	}

	/**
	 * Retrieve a lesson
	 * @param lessonId the id to find the lesson
	 */
	public static async getLesson(lessonId: number): Promise<Lesson> {
		return {
			title: "Song",
			description: "A song",
			requiredLevel: 1,
			mainSkill: 'lead-head-change',
			id: lessonId
		};
	}

	/**
	 * Retrieve the authenticated user's search history
	 * @param lessonId the id to find the lesson
	 */
	public static async getSearchHistory(): Promise<Song[]> {
		return Array.of(4).map((i) => ({
			id: i,
			name: `Song in history ${i}`,
			artistId: i,
			genreId: i,
			albumId: i,
			cover: dummyIllustration,
			metrics: {}
		}));
	}

	/**
	 * Retrieve the authenticated user's recommendations
	 */
	public static async getUserRecommendations(): Promise<Song[]> {
		return Array.of(4).map((i) => ({
			id: i,
			name: `Recommended Song ${i}`,
			artistId: i,
			genreId: i,
			albumId: i,
			cover: dummyIllustration,
			metrics: {}
		}));
	}

	/**
	 * Retrieve the authenticated user's play history
	 */
	public static async getUserPlayHistory(): Promise<Song[]> {
		return Array.of(4).map((i) => ({
			id: i,
			name: `played Song ${i}`,
			artistId: i,
			genreId: i,
			albumId: i,
			cover: dummyIllustration,
			metrics: {}
		}));
	}

	/**
	 * Retrieve a lesson's history
	 * @param lessonId the id to find the lesson
	 */
	public static async getLessonHistory(lessonId: number): Promise<LessonHistory[]> {
		return [{
			lessonId,
			userId: 1
		}];
	}
}
