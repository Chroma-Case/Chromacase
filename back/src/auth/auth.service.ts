import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import * as bcrypt from 'bcryptjs';
import PayloadInterface from './interface/payload.interface';
@Injectable()
export class AuthService {
	private readonly client : OAuth2Client;

	constructor(
		private userService: UsersService,
		private readonly configService: ConfigService,
		private jwtService: JwtService,
	) {
		this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
	}

	async validateUser(
		username: string,
		password: string,
	): Promise<PayloadInterface | null> {
		const user = await this.userService.user({ username });
		if (user && bcrypt.compareSync(password, user.password)) {
			return {
				username: user.username,
				id: user.id,
			};
		}
		return null;
	}

	async login(user: PayloadInterface) {
		const payload = { username: user.username, id: user.id };
		const access_token = this.jwtService.sign(payload);
		return {
			access_token,
		};
	}

	async loginWithGoogleMobile(idToken: string) {
		const ticket = await this.client.verifyIdToken({
			idToken,
			audience: this.configService.get("GOOGLE_CLIENT_ID"),
		});
		const payload = ticket.getPayload();
		if (payload) {
			const user = await this.userService.findOrCreate({
				email: payload.email,
				firstName: payload.given_name,
				lastName: payload.family_name,
				picture: payload.picture,
				googleId: payload.sub,
			});
			const jwt = await this.login(user);
			return { user, jwt };
		} else {
			throw new BadRequestException();
		}
	}
}
