import {
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { createHash, randomUUID } from 'crypto';
import { createReadStream, existsSync } from 'fs';
import fetch from 'node-fetch';

@Injectable()
export class UsersService {
	constructor(
		private prisma: PrismaService,
	) {}

	async user(
		userWhereUniqueInput: Prisma.UserWhereUniqueInput,
	): Promise<User | null> {
		return this.prisma.user.findUnique({
			where: userWhereUniqueInput,
		});
	}

	async users(params: {
		skip?: number;
		take?: number;
		cursor?: Prisma.UserWhereUniqueInput;
		where?: Prisma.UserWhereInput;
		orderBy?: Prisma.UserOrderByWithRelationInput;
	}): Promise<User[]> {
		const { skip, take, cursor, where, orderBy } = params;
		return this.prisma.user.findMany({
			skip,
			take,
			cursor,
			where,
			orderBy,
		});
	}

	async createUser(data: Prisma.UserCreateInput): Promise<User> {
		if (data.password) data.password = await bcrypt.hash(data.password, 8);
		return this.prisma.user.create({
			data,
		});
	}

	async createGuest(): Promise<User> {
		return this.prisma.user.create({
			data: {
				username: `Guest ${randomUUID()}`,
				isGuest: true,
				// Not realyl clean but better than a separate table or breaking the api by adding nulls.
				email: '',
				password: '',
			},
		});
	}

	async updateUser(params: {
		where: Prisma.UserWhereUniqueInput;
		data: Prisma.UserUpdateInput;
	}): Promise<User> {
		const { where, data } = params;
		if (typeof data.password === 'string')
			data.password = await bcrypt.hash(data.password, 8);
		else if (data.password && data.password.set)
			data.password = await bcrypt.hash(data.password.set, 8);
		return this.prisma.user.update({
			data,
			where,
		});
	}

	async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
		return this.prisma.user.delete({
			where,
		});
	}

	async getProfilePicture(userId: number, res: any) {
		const path = `/data/${userId}.jpg`;
		if (existsSync(path)) {
			const file = createReadStream(path);
			return file.pipe(res);
		}
		// We could not find a profile icon locally, using gravatar instead.
		const user = await this.user({ id: userId });
		if (!user) throw new InternalServerErrorException();
		const hash = createHash('md5')
			.update(user.email.trim().toLowerCase())
			.digest('hex');
		const resp = await fetch(
			`https://www.gravatar.com/avatar/${hash}.jpg?d=404&s=200`,
		);
		for (const [k, v] of resp.headers) resp.headers.set(k, v);
		resp.body!.pipe(res);
	}
}
