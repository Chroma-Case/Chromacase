import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_SECRET,
			callbackURL: 'http://localhost:3000/google/redirect',
			scope: ['email', 'profile'],
		});
	}

	async validate(
		_accessToken: string,
		_refreshToken: string,
		profile: any,
		done: VerifyCallback,
	): Promise<any> {
		console.log(profile);
		const { name, emails, photos, username } = profile;
		const user = {
			email: emails[0].value,
			username,
			password: null,
			// firstName: name.givenName,
			// lastName: name.familyName,
			// picture: photos[0].value,
		};
		done(null, user);
	}
}
