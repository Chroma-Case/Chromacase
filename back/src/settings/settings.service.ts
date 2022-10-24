import { Injectable } from '@nestjs/common';
import { Prisma, UserSettings } from '@prisma/client';
import { Setting } from 'src/models/setting';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSettingDto } from './dto/create-setting.dto';

@Injectable()
export class SettingsService {
	constructor(private prisma: PrismaService) {}

	async setting(
		settingWhereUniqueInput: Prisma.UserSettingsWhereUniqueInput,
	): Promise<UserSettings | null> {
		return this.prisma.userSettings.findUnique({
			where: settingWhereUniqueInput,
		});
	}

	async createUserSetting(userId: number, data: Prisma.UserSettingsUncheckedCreateInput): Promise<UserSettings> {
		data.userId = userId;
		return this.prisma.userSettings.create({
			data,
		})
	}

	async updateUser(params: {
		where: Prisma.UserSettingsWhereUniqueInput;
		data: Prisma.UserSettingsUpdateInput;
	}): Promise<UserSettings> {
		const { where, data } = params;
		return this.prisma.userSettings.update({
			data,
			where,
		});
	}

	async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<UserSettings> {
		return this.prisma.userSettings.delete({
			where,
		});
	}
}
