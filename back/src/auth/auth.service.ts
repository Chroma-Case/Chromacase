import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import PayloadInterface from './interface/payload.interface';
import { User } from 'src/models/user';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class AuthService {
	constructor(
		private userService: UsersService,
		private jwtService: JwtService,
		private emailService: MailerService,
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

	async sendVerifyMail(user: User) {
		if (process.env.IGNORE_MAILS === "true") return;
		const token = await this.jwtService.signAsync(
			{
				userId: user.id,
			},
			{ expiresIn: '10h' },
		);
		await this.emailService.sendMail({
			to: user.email,
			from: 'chromacase@octohub.app',
			subject: 'Mail verification for Chromacase',
			html: `To verify your mail, please click on this <a href="{${process.env.PUBLIC_URL}/verify?token=${token}">link</a>.`,
		});
	}

	async verifyMail(userId: number, token: string): Promise<boolean> {
		try {
			await this.jwtService.verifyAsync(token);
		} catch(e) {
			console.log("Verify mail token failure", e);
			return false;
		}
		await this.userService.updateUser({
			where: { id: userId },
			data: { emailVerified: true },
		});
		return true;
	}
}
