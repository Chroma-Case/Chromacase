import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import PayloadInterface from "./interface/payload.interface";
import { User } from "src/models/user";
import { MailerService } from "@nestjs-modules/mailer";
@Injectable()
export class AuthService {
	constructor(
		private userService: UsersService,
		private jwtService: JwtService,
		private emailService: MailerService,
	) {}

	validateApiKey(apikey: string): boolean {
		if (process.env.API_KEYS == null) return false;
		const keys = process.env.API_KEYS.split(',');
		return keys.includes(apikey);

	}

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
		if (user.email == null) return;
		console.log("Sending verification mail to", user.email);
		const token = await this.jwtService.signAsync(
			{
				userId: user.id,
			},
			{ expiresIn: "10h" },
		);
		await this.emailService.sendMail({
			to: user.email,
			from: "chromacase@octohub.app",
			subject: "Mail verification for Chromacase",
			html: `To verify your mail, please click on this <a href="${process.env.PUBLIC_URL}/verify?token=${token}">link</a>.`,
		});
	}

	async sendPasswordResetMail(user: User) {
		if (process.env.IGNORE_MAILS === "true") return;
		if (user.email == null) return;
		console.log("Sending password reset mail to", user.email);
		const token = await this.jwtService.signAsync(
			{
				userId: user.id,
			},
			{ expiresIn: "10h" },
		);
		await this.emailService.sendMail({
			to: user.email,
			from: "chromacase@octohub.app",
			subject: "Password reset for Chromacase",
			html: `To reset your password, please click on this <a href="${process.env.PUBLIC_URL}/password_reset?token=${token}">link</a>.`,
		});
	}

	async changePassword(new_password: string, token: string): Promise<boolean> {
		let verified;
		try {
			verified = await this.jwtService.verifyAsync(token);
		} catch (e) {
			console.log("Password reset token failure", e);
			return false;
		}
		console.log(verified);
		await this.userService.updateUser({
			where: { id: verified.userId },
			data: { password: new_password },
		});
		return true;
	}

	async verifyMail(userId: number, token: string): Promise<boolean> {
		try {
			await this.jwtService.verifyAsync(token);
		} catch (e) {
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
