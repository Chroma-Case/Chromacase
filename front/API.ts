import Artist from './models/Artist';
import Album from './models/Album';
import Chapter from './models/Chapter';
import Lesson from './models/Lesson';
import Genre from './models/Genre';
import LessonHistory from './models/LessonHistory';
import Song from './models/Song';
import SongHistory from './models/SongHistory';
import User from './models/User';
import Constants from 'expo-constants';
import store from './state/Store';
import { Platform } from 'react-native';
import { en } from './i18n/Translations';
import UserSettings from './models/UserSettings';
import { PartialDeep } from 'type-fest';
import SearchHistory from './models/SearchHistory';
import { Query } from './Queries';
import CompetenciesTable from './components/CompetenciesTable';

type AuthenticationInput = { username: string; password: string };
type RegistrationInput = AuthenticationInput & { email: string };

export type AccessToken = string;

type FetchParams = {
	route: string;
	body?: object;
	method?: 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT';
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
		public userMessage: keyof typeof en = 'unknownError'
	) {
		super(message);
	}
}

// we will need the same thing for the scorometer API url
const baseAPIUrl =
	process.env.NODE_ENV != 'development' && Platform.OS === 'web'
		? '/api'
		: Constants.manifest?.extra?.apiUrl;

export default class API {
	public static async fetch(params: FetchParams) {
		const jwtToken = store.getState().user.accessToken;
		const header = {
			'Content-Type': 'application/json',
		};
		const response = await fetch(`${baseAPIUrl}${params.route}`, {
			headers: (jwtToken && { ...header, Authorization: `Bearer ${jwtToken}` }) || header,
			body: JSON.stringify(params.body),
			method: params.method ?? 'GET',
		}).catch(() => {
			throw new Error('Error while fetching API: ' + baseAPIUrl);
		});
		if (params.raw) {
			return response.arrayBuffer();
		}
		const body = await response.text();
		try {
			const jsonResponse = body.length != 0 ? JSON.parse(body) : {};
			if (!response.ok) {
				throw new APIError(response.statusText ?? body, response.status);
			}
			return jsonResponse;
		} catch (e) {
			if (e instanceof SyntaxError) throw new Error("Error while parsing Server's response");
			throw e;
		}
	}

	public static async authenticate(
		authenticationInput: AuthenticationInput
	): Promise<AccessToken> {
		return API.fetch({
			route: '/auth/login',
			body: authenticationInput,
			method: 'POST',
		})
			.then((responseBody) => responseBody.access_token)
			.catch((e) => {
				if (!(e instanceof APIError)) throw e;

				if (e.status == 401)
					throw new APIError('invalidCredentials', 401, 'invalidCredentials');
				throw e;
			});
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
			method: 'POST',
		});
		// In the Future we should move autheticate out of this function
		// and maybe create a new function to create and login in one go
		return API.authenticate({
			username: registrationInput.username,
			password: registrationInput.password,
		});
	}

	public static async createAndGetGuestAccount(): Promise<AccessToken> {
		const response = await API.fetch({
			route: '/auth/guest',
			method: 'POST',
		});
		if (!response.access_token) throw new APIError('No access token', response.status);
		return response.access_token;
	}

	public static async transformGuestToUser(registrationInput: RegistrationInput): Promise<void> {
		await API.fetch({
			route: '/auth/me',
			body: registrationInput,
			method: 'PUT',
		});
	}

	/***
	 * Retrieve information of the currently authentified user
	 */
	public static getUserInfo(): Query<User> {
		return {
			key: 'user',
			exec: async () => {
				const user = await API.fetch({
					route: '/auth/me',
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
						createdAt: new Date('2023-04-09T00:00:00.000Z'),
						avatar: 'https://imgs.search.brave.com/RnQpFhmAFvuQsN_xTw7V-CN61VeHDBg2tkEXnKRYHAE/rs:fit:768:512:1/g:ce/aHR0cHM6Ly96b29h/c3Ryby5jb20vd3At/Y29udGVudC91cGxv/YWRzLzIwMjEvMDIv/Q2FzdG9yLTc2OHg1/MTIuanBn',
					},
				} as User;
			},
		};
	}

	public static getUserSettings(): Query<UserSettings> {
		return {
			key: 'settings',
			exec: async () => {
				const settings = await API.fetch({
					route: '/auth/me/settings',
				});

				return {
					notifications: {
						pushNotif: settings.pushNotification,
						emailNotif: settings.emailNotification,
						trainNotif: settings.trainingNotification,
						newSongNotif: settings.newSongNotification,
					},
					recommendations: settings.recommendations,
					weeklyReport: settings.weeklyReport,
					leaderBoard: settings.leaderBoard,
					showActivity: settings.showActivity,
				};
			},
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
		};
		return API.fetch({
			method: 'PATCH',
			route: '/auth/me/settings',
			body: dto,
		});
	}

	public static getUserSkills(): Query<Parameters<typeof CompetenciesTable>[0]> {
		return {
			key: 'skills',
			exec: async () => ({
				pedalsCompetency: Math.random() * 100,
				rightHandCompetency: Math.random() * 100,
				leftHandCompetency: Math.random() * 100,
				accuracyCompetency: Math.random() * 100,
				arpegeCompetency: Math.random() * 100,
				chordsCompetency: Math.random() * 100,
			}),
		};
	}

	public static getAllSongs(): Query<Song[]> {
		return {
			key: 'songs',
			exec: async () => {
				const songs = await API.fetch({
					route: '/song',
				});

				// this is a dummy illustration, we will need to fetch the real one from the API
				return songs.data.map(
					// To be fixed with #168
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(song: any) =>
						({
							id: song.id as number,
							name: song.name as string,
							artistId: song.artistId as number,
							albumId: song.albumId as number,
							genreId: song.genreId as number,
							details: song.difficulties,
							cover: `${baseAPIUrl}/song/${song.id}/illustration`,
							metrics: {},
						} as Song)
				);
			},
		};
	}

	/**
	 * Retrieve a song
	 * @param songId the id to find the song
	 */
	public static getSong(songId: number): Query<Song> {
		return {
			key: ['song', songId],
			exec: async () => {
				const song = await API.fetch({
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
					cover: `${baseAPIUrl}/song/${song.id}/illustration`,
				} as Song;
			},
		};
	}
	/**
	 * Retrive a song's midi partition
	 * @param songId the id to find the song
	 */
	public static getSongMidi(songId: number): Query<ArrayBuffer> {
		return {
			key: ['midi', songId],
			exec: () =>
				API.fetch({
					route: `/song/${songId}/midi`,
					raw: true,
				}),
		};
	}

	/**
	 * Retrive a song's midi partition
	 * @param songId the id to find the song
	 */
	public static getArtistIllustration(artistId: number): string {
		return `${baseAPIUrl}/artist/${artistId}/illustration`;
	}

	/**
	 * Retrive a song's midi partition
	 * @param songId the id to find the song
	 */
	public static getGenreIllustration(genreId: number): string {
		return `${baseAPIUrl}/genre/${genreId}/illustration`;
	}

	/**
	 * Retrive a song's musicXML partition
	 * @param songId the id to find the song
	 */
	public static getSongMusicXML(songId: number): Query<ArrayBuffer> {
		return {
			key: ['musixml', songId],
			exec: () =>
				API.fetch({
					route: `/song/${songId}/musicXml`,
					raw: true,
				}),
		};
	}

	/**
	 * Retrive an artist
	 */
	public static getArtist(artistId: number): Query<Artist> {
		return {
			key: ['artist', artistId],
			exec: () =>
				API.fetch({
					route: `/artist/${artistId}`,
				}),
		};
	}

	/**
	 * Retrive a song's chapters
	 * @param songId the id to find the song
	 */
	public static getSongChapters(songId: number): Query<Chapter[]> {
		return {
			key: ['chapters', songId],
			exec: async () =>
				[1, 2, 3, 4, 5].map((value) => ({
					start: 100 * (value - 1),
					end: 100 * value,
					songId: songId,
					name: `Chapter ${value}`,
					type: 'chorus',
					key_aspect: 'rhythm',
					difficulty: value,
					id: value * 10,
				})),
		};
	}

	/**
	 * Retrieve a song's play history
	 * @param songId the id to find the song
	 */
	public static getSongHistory(songId: number): Query<{ best: number; history: SongHistory[] }> {
		return {
			key: ['song', 'history', songId],
			exec: () =>
				API.fetch({
					route: `/song/${songId}/history`,
				}),
		};
	}

	/**
	 * Search a song by its name
	 * @param query the string used to find the songs
	 */
	public static searchSongs(query: string): Query<Song[]> {
		return {
			key: ['search', 'song', query],
			exec: () =>
				API.fetch({
					route: `/search/songs/${query}`,
				}),
		};
	}

	/**
	 * Search artists by name
	 * @param query the string used to find the artists
	 */
	public static searchArtists(query: string): Query<Artist[]> {
		return {
			key: ['search', 'artist', query],
			exec: () =>
				API.fetch({
					route: `/search/artists/${query}`,
				}),
		};
	}

	/**
	 * Search Album by name
	 * @param query the string used to find the album
	 */
	public static searchAlbum(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		query: string
	): Query<Album[]> {
		return {
			key: ['search', 'album', query],
			exec: async () =>
				[
					{
						id: 1,
						name: 'Super Trooper',
					},
					{
						id: 2,
						name: 'Kingdom Heart 365/2 OST',
					},
					{
						id: 3,
						name: 'The Legend Of Zelda Ocarina Of Time OST',
					},
					{
						id: 4,
						name: 'Random Access Memories',
					},
				] as Album[],
		};
	}

	/**
	 * Retrieve music genres
	 */
	public static searchGenres(query: string): Query<Genre[]> {
		return {
			key: ['search', 'genre', query],
			exec: () =>
				API.fetch({
					route: `/search/genres/${query}`,
				}),
		};
	}

	/**
	 * Retrieve a lesson
	 * @param lessonId the id to find the lesson
	 */
	public static getLesson(lessonId: number): Query<Lesson> {
		return {
			key: ['lesson', lessonId],
			exec: async () => ({
				title: 'Song',
				description: 'A song',
				requiredLevel: 1,
				mainSkill: 'lead-head-change',
				id: lessonId,
			}),
		};
	}

	/**
	 * Retrieve the authenticated user's search history
	 * @param skip number of entries skipped before returning
	 * @param take how much do we take to return
	 * @returns Returns an array of history entries (temporary type any)
	 */
	public static getSearchHistory(skip?: number, take?: number): Query<SearchHistory[]> {
		return {
			key: ['search', 'history', 'skip', skip, 'take', take],
			exec: () =>
				API.fetch({
					route: `/history/search?skip=${skip ?? 0}&take=${take ?? 5}`,
					method: 'GET',
				}).then((value) =>
					value.map(
						// To be fixed with #168
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						(e: any) =>
							({
								id: e.id,
								query: e.query,
								type: e.type,
								userId: e.userId,
								timestamp: new Date(e.searchDate),
							} as SearchHistory)
					)
				),
		};
	}

	/**
	 * Posts a new entry in the user's search history
	 * @param query is the query itself
	 * @param type the type of object searched
	 * @param timestamp the date it's been issued
	 * @returns nothing
	 */
	public static async createSearchHistoryEntry(query: string, type: string): Promise<void> {
		return await API.fetch({
			route: `/history/search`,
			method: 'POST',
			body: {
				query: query,
				type: type,
			},
		});
	}

	/**
	 * Retrieve the authenticated user's recommendations
	 * @returns an array of songs
	 */
	public static getSongSuggestions(): Query<Song[]> {
		return API.getAllSongs();
	}

	/**
	 * Retrieve the authenticated user's play history
	 * * @returns an array of songs
	 */
	public static getUserPlayHistory(): Query<SongHistory[]> {
		return {
			key: ['history'],
			exec: () =>
				this.fetch({
					route: '/history',
				}),
		};
	}

	/**
	 * Retrieve a lesson's history
	 * @param lessonId the id to find the lesson
	 */
	public static getLessonHistory(lessonId: number): Query<LessonHistory[]> {
		return {
			key: ['lesson', 'history', lessonId],
			exec: async () => [
				{
					lessonId,
					userId: 1,
				},
			],
		};
	}

	public static async updateUserEmail(newEmail: string): Promise<User> {
		const rep = await API.fetch({
			route: '/auth/me',
			method: 'PUT',
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
			route: '/auth/me',
			method: 'PUT',
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
