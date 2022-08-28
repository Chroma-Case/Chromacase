import AuthToken from "./models/AuthToken";
import Chapter from "./models/Chapter";
import Lesson from "./models/Lesson";
import LessonHistory from "./models/LessonHistory";
import Song from "./models/Song";
import SongHistory from "./models/SongHistory";
import User from "./models/User";

const delay = (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds * 1000));

declare type AuthenticationInput = { email: string, password: string };

export default class API {

	/***
	 * Retrieve information of the currently authentified user
	 */
	static async getUserInfo(): Promise<User> {
		return {
			name: "User",
			email: "user@chromacase.com",
			xp: 0,
			premium: false,
			metrics: {},
			settings: {},
			id: 1
		}
	}

	/**
	 * Logs the user in, with an email and a password
	 * @param _credentials the credentials to get an authentication token
	 * @returns an authentication token, that must be used for authentified requests
	 */
	static async login(_credentials: AuthenticationInput): Promise<AuthToken> {
		return "12345";
	}

	/**
	 * Create a new user profile, with an email and a password
	 * @param _credentials the credentials to create a new profile
	 * @returns an empty promise. On error, the promise will not be resolved
	 */
	static async register(_credentials: AuthenticationInput): Promise<void> {
		return;
	}

	/**
	 * Authentify a new user through Google
	 */
	static async authWithGoogle(): Promise<AuthToken> {
		return "11111";
	}

	/**
	 * Retrive a song
	 * @param songId the id to find the song
	 */
	static async getSong(songId: number): Promise<Song> {
		return delay(1).then(() => ({
			title: "Song",
			description: "A song",
			album: "Album",
			metrics: {},
			id: songId
		}));
		
	}

	/**
	 * Retrive a song's chapters
	 * @param songId the id to find the song
	 */
	 static async getSongChapters(songId: number): Promise<Chapter[]> {
		return [{
			start: 0,
			end: 100,
			songId: songId,
			name: "Chapter",
			type: "chorus",
			key_aspect: "rhythm",
			difficulty: 1,
			id: 1
		}];
	}

	/**
	 * Retrieve a song's play history
	 * @param songId the id to find the song
	 */
	 static async getSongHistory(songId: number): Promise<SongHistory[]> {
		return [{
			songId: songId,
			userId: 1,
			score: 2
		}];
	}

	/**
	 * Search a song by its name
	 * @param query the string used to find the songs
	 */
	 static async searchSongs(query: string): Promise<Song[]> {
		return [{
			title: "Song",
			description: "A song",
			album: "Album",
			metrics: {},
			id: 1
		}];
	}

	/**
	 * Retrieve a lesson
	 * @param lessonId the id to find the lesson
	 */
	 static async getLesson(lessonId: number): Promise<Lesson> {
		return {
			title: "Song",
			description: "A song",
			requiredLevel: 1,
			mainSkill: 'lead-head-change',
			id: lessonId
		};
	}

	/**
	 * Retrieve a lesson's history
	 * @param lessonId the id to find the lesson
	 */
	 static async getLessonHistory(lessonId: number): Promise<LessonHistory[]> {
		return [{
			lessonId,
			userId: 1
		}];
	}
}