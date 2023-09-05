import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import PayloadInterface from './interface/payload.interface';
@Injectable()
export class AuthService {
	constructor(
		private userService: UsersService,
		private jwtService: JwtService,
	) {}

	async validateUser(
		username: string,
		password: string,
	): Promise<PayloadInterface | null> {
		const user = await this.userService.user({ username });
		if (user && user.password && bcrypt.compareSync(password, user.password)) {
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
}
