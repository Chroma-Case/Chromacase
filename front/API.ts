import Artist from "./models/Artist";
import AuthToken from "./models/AuthToken";
import Chapter from "./models/Chapter";
import Lesson from "./models/Lesson";
import LessonHistory from "./models/LessonHistory";
import Song from "./models/Song";
import SongHistory from "./models/SongHistory";
import User from "./models/User";
import Constants from "expo-constants";
import store from "./state/Store";
import { Platform } from "react-native";
import { en } from "./i18n/Translations";
import { QueryClient } from "react-query";
import UserSettings from "./models/UserSettings";
import { PartialDeep } from "type-fest";
import SearchHistory from "./models/SearchHistory";

type AuthenticationInput = { username: string; password: string };
type RegistrationInput = AuthenticationInput & { email: string };

export type AccessToken = string;

type FetchParams = {
	route: string;
	body?: Object;
	method?: "GET" | "POST" | "DELETE" | "PATCH" | "PUT";
	// If true, No JSON parsing is done, the raw response's content is returned
	raw?: true;
};

// This Exception is intended to cover all business logic errors (invalid credentials, couldn't find a song, etc.)
// technical errors (network, server, etc.) should be handled as standard Error exceptions
// it helps to filter errors in the catch block, APIErrors messages should
// be safe to use in combination with the i18n library
export class APIError extends Error {
	constructor(
		message: string,
		public status: number,
		// Set the message to the correct error this is a placeholder
		// when the error is only used internally (middleman)
		public userMessage: keyof typeof en = "unknownError"
	) {
		super(message);
	}
}

const dummyIllustrations = [
	"https://i.discogs.com/syRCX8NaLwK2SMk8X6TVU_DWc8RRqE4b-tebAQ6kVH4/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTgyNTQz/OC0xNjE3ODE0NDI2/LTU1MjUuanBlZw.jpeg",
	"https://folkr.fr/wp-content/uploads/2017/06/dua-lipa-folkr-2017-cover-04.jpg",
	"https://folkr.fr/wp-content/uploads/2017/06/dua-lipa-folkr-2017-cover-03.jpg",
	"https://cdn.fireemblemwiki.org/e/eb/Album_106698A.jpg",
	"https://upload.wikimedia.org/wikipedia/en/8/84/California_Gurls_cover.png",
	"https://upload.wikimedia.org/wikipedia/en/a/a2/Katy_Perry_-_Peacock_%282012%29.jpg",
	"https://upload.wikimedia.org/wikipedia/en/d/d5/Katy_Perry_feat._Riff_Raff_-_This_Is_How_We_Do.png",
	"https://upload.wikimedia.org/wikipedia/en/8/83/David_Guetta_-_I_Can_Only_Imagine.jpg",
	"https://upload.wikimedia.org/wikipedia/en/f/f3/David_Guetta_-_Pop_Life_-_2007.jpg",
	"https://upload.wikimedia.org/wikipedia/en/b/ba/David_Guetta_2U.jpg",
];

const getDummyIllustration = () =>
	dummyIllustrations[Math.floor(Math.random() * dummyIllustrations.length)];

// we will need the same thing for the scorometer API url
const baseAPIUrl =
	process.env.NODE_ENV != "development" && Platform.OS === "web"
		? "/api"
		: Constants.manifest?.extra?.apiUrl;

export default class API {
	public static async fetch(params: FetchParams) {
		const jwtToken = store.getState().user.accessToken;
		const header = {
			"Content-Type": "application/json",
		};
		const response = await fetch(`${baseAPIUrl}${params.route}`, {
			headers:
				(jwtToken && { ...header, Authorization: `Bearer ${jwtToken}` }) ||
				header,
			body: JSON.stringify(params.body),
			method: params.method ?? "GET",
		}).catch(() => {
			throw new Error("Error while fetching API: " + baseAPIUrl);
		});
		if (params.raw) {
			return response.arrayBuffer();
		}
		const body = await response.text();
		try {
			const jsonResponse = body.length != 0 ? JSON.parse(body) : {};
			if (!response.ok) {
				throw new APIError(
					jsonResponse ?? response.statusText,
					response.status
				);
			}
			return jsonResponse;
		} catch (e) {
			if (e instanceof SyntaxError)
				throw new Error("Error while parsing Server's response");
			throw e;
		}
	}

	public static async authenticate(
		authenticationInput: AuthenticationInput
	): Promise<AccessToken> {
		return API.fetch({
			route: "/auth/login",
			body: authenticationInput,
			method: "POST",
		})
			.then((responseBody) => responseBody.access_token)
			.catch((e) => {
				if (!(e instanceof APIError)) throw e;

				if (e.status == 401)
					throw new APIError("invalidCredentials", 401, "invalidCredentials");
				throw e;
			});
	}
	/**
	 * Create a new user profile, with an email and a password
	 * @param registrationInput the credentials to create a new profile
	 * @returns A Promise. On success, will be resolved into an instance of the API wrapper
	 */
	public static async createAccount(
		registrationInput: RegistrationInput
	): Promise<AccessToken> {
		await API.fetch({
			route: "/auth/register",
			body: registrationInput,
			method: "POST",
		});
		// In the Future we should move autheticate out of this function
		// and maybe create a new function to create and login in one go
		return API.authenticate({
			username: registrationInput.username,
			password: registrationInput.password,
		});
	}

	public static async createAndGetGuestAccount(): Promise<AccessToken> {
		let response = await API.fetch({
			route: "/auth/guest",
			method: "POST",
		});
		if (!response.access_token)
			throw new APIError("No access token", response.status);
		return response.access_token;
	}

	public static async transformGuestToUser(registrationInput: RegistrationInput): Promise<void> {
		await API.fetch({
			route: "/auth/me",
			body: registrationInput,
			method: "PUT",
		});
	}

	/***
	 * Retrieve information of the currently authentified user
	 */
	public static async getUserInfo(): Promise<User> {
		let user = await API.fetch({
			route: "/auth/me",
		});

		// this a dummy settings object, we will need to fetch the real one from the API
		return {
			id: user.id as number,
			name: (user.username ?? user.name) as string,
			email: user.email as string,
			premium: false,
			isGuest: user.isGuest as boolean,
			data: {
				gamesPlayed: user.partyPlayed as number,
				xp: 0,
				createdAt: new Date("2023-04-09T00:00:00.000Z"),
				avatar:
					"https://imgs.search.brave.com/RnQpFhmAFvuQsN_xTw7V-CN61VeHDBg2tkEXnKRYHAE/rs:fit:768:512:1/g:ce/aHR0cHM6Ly96b29h/c3Ryby5jb20vd3At/Y29udGVudC91cGxv/YWRzLzIwMjEvMDIv/Q2FzdG9yLTc2OHg1/MTIuanBn",
			}
		} as User;
	}

	public static async getUserSettings(): Promise<UserSettings> {
		const settings = await API.fetch({
			route: "/auth/me/settings",
		});

		return {
			notifications: {
				pushNotif: settings.pushNotification,
				emailNotif: settings.emailNotification,
				trainNotif: settings.trainingNotification,
				newSongNotif: settings.newSongNotification
			},
			recommendations: settings.recommendations,
			weeklyReport: settings.weeklyReport,
			leaderBoard: settings.leaderBoard,
			showActivity: settings.showActivity
		};
	}

	public static async updateUserSettings(settings: PartialDeep<UserSettings>): Promise<void> {
		const dto = {
			pushNotification: settings.notifications?.pushNotif,
			emailNotification: settings.notifications?.emailNotif,
			trainingNotification: settings.notifications?.trainNotif,
			newSongNotification: settings.notifications?.newSongNotif,
			recommendations: settings.recommendations,
			weeklyReport: settings.weeklyReport,
			leaderBoard: settings.leaderBoard,
			showActivity: settings.showActivity,
		}
		return API.fetch({
			method: 'PATCH',
			route: '/auth/me/settings',
			body: dto
		});
	}

	public static async getUserSkills() {
		return {
			pedalsCompetency: Math.random() * 100,
			rightHandCompetency: Math.random() * 100,
			leftHandCompetency: Math.random() * 100,
			accuracyCompetency: Math.random() * 100,
			arpegeCompetency: Math.random() * 100,
			chordsCompetency: Math.random() * 100,
		};
	}

	/**
	 * Authentify a new user through Google
	 */
	public static async authWithGoogle(): Promise<AuthToken> {
		//TODO
		return "11111";
	}

	public static async getAllSongs(): Promise<Song[]> {
		let songs = await API.fetch({
			route: "/song",
		});

		// this is a dummy illustration, we will need to fetch the real one from the API
		return songs.data.map(
			(song: any) =>
				({
					id: song.id as number,
					name: song.name as string,
					artistId: song.artistId as number,
					albumId: song.albumId as number,
					genreId: song.genreId as number,
					details: song.difficulties,
					cover: getDummyIllustration(),
					metrics: {},
				} as Song)
		);
	}

	/**
	 * Retrieve a song
	 * @param songId the id to find the song
	 */
	public static async getSong(songId: number): Promise<Song> {
		let song = await API.fetch({
			route: `/song/${songId}`,
		});

		// this is a dummy illustration, we will need to fetch the real one from the API
		return {
			id: song.id as number,
			name: song.name as string,
			artistId: song.artistId as number,
			albumId: song.albumId as number,
			genreId: song.genreId as number,
			details: song.difficulties,
			cover: getDummyIllustration(),
		} as Song;
	}
	/**
	 * Retrive a song's midi partition
	 * @param songId the id to find the song
	 */
	public static async getSongMidi(songId: number): Promise<any> {
		return API.fetch({
			route: `/song/${songId}/midi`,
			raw: true,
		});
	}

	/**
	 * Retrive a song's musicXML partition
	 * @param songId the id to find the song
	 */
	public static async getSongMusicXML(songId: number): Promise<any> {
		return API.fetch({
			route: `/song/${songId}/musicXml`,
			raw: true,
		});
	}

	/**
	 * Retrive an artist
	 */
	public static async getArtist(artistId: number): Promise<Artist> {
		return API.fetch({
			route: `/artist/${artistId}`,
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
			id: value * 10,
		}));
	}

	/**
	 * Retrieve a song's play history
	 * @param songId the id to find the song
	 */
	public static async getSongHistory(songId: number): Promise<SongHistory[]> {
		return [67, 4578, 2, 9990].map((value) => ({
			songID: songId,
			userID: 1,
			score: value,
			difficulties: {}
		}));
	}

	/**
	 * Search a song by its name
	 * @param query the string used to find the songs
	 */
	public static async searchSongs(query: string): Promise<Song[]> {
		return API.fetch({
			route: `/search/guess/song/${query}`,
		});
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
			mainSkill: "lead-head-change",
			id: lessonId,
		};
	}

	/**
	 * Retrieve the authenticated user's search history
	 * @param lessonId the id to find the lesson
	 */
	public static async getSearchHistory(): Promise<SearchHistory[]> {
		const tmp = await this.fetch({
			route: "/history/search",
		});

		return tmp.map((value: any) => ({
			query: value.query,
			userID: value.userId,
			id: value.id,
		}));
	}

	/**
	 * Retrieve the authenticated user's recommendations
	 */
	public static async getUserRecommendations(): Promise<Song[]> {
		const queryClient = new QueryClient();
		return await queryClient.fetchQuery(["API", "allsongs"], API.getAllSongs);
	}

	/**
	 * Retrieve the authenticated user's play history
	 */
	public static async getUserPlayHistory(): Promise<SongHistory[]> {
		return this.fetch({
			route: '/history'
		});
	}

	/**
	 * Retrieve a lesson's history
	 * @param lessonId the id to find the lesson
	 */
	public static async getLessonHistory(
		lessonId: number
	): Promise<LessonHistory[]> {
		return [
			{
				lessonId,
				userId: 1,
			},
		];
	}

	/**
	 * Retrieve a partition images
	 * @param songId the id of the song
	 * This API may be merged with the fetch song in the future
	 */
	public static async getPartitionRessources(
		songId: number
	): Promise<[string, number, number][]> {
		return [
			[
				"https://media.discordapp.net/attachments/717080637038788731/1067469560426545222/vivaldi_split_1.png",
				1868,
				400,
			],
			[
				"https://media.discordapp.net/attachments/717080637038788731/1067469560900505660/vivaldi_split_2.png",
				1868,
				400,
			],
			[
				"https://media.discordapp.net/attachments/717080637038788731/1067469561261203506/vivaldi_split_3.png",
				1868,
				400,
			],
			[
				"https://media.discordapp.net/attachments/717080637038788731/1067469561546424381/vivaldi_split_4.png",
				1868,
				400,
			],
			[
				"https://media.discordapp.net/attachments/717080637038788731/1067469562058133564/vivaldi_split_5.png",
				1868,
				400,
			],
			[
				"https://media.discordapp.net/attachments/717080637038788731/1067469562347528202/vivaldi_split_6.png",
				1868,
				400,
			],
			[
				"https://media.discordapp.net/attachments/717080637038788731/1067469562792136815/vivaldi_split_7.png",
				1868,
				400,
			],
			[
				"https://media.discordapp.net/attachments/717080637038788731/1067469563073142804/vivaldi_split_8.png",
				1868,
				400,
			],
		];
	}

	public static async updateUserEmail(newEmail: string): Promise<User> {
		const rep = await API.fetch({
			route: "/auth/me",
			method: "PUT",
			body: {
				email: newEmail,
			},
		});

		if (rep.error) {
			throw new Error(rep.error);
		}
		return rep;
	}

	public static async updateUserPassword(
		oldPassword: string,
		newPassword: string
	): Promise<User> {
		const rep = await API.fetch({
			route: "/auth/me",
			method: "PUT",
			body: {
				oldPassword: oldPassword,
				password: newPassword,
			},
		});

		if (rep.error) {
			throw new Error(rep.error);
		}
		return rep;
	}
}
