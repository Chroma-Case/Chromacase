import {
	Controller,
	Get,
	Post,
	Patch,
	Body,
	NotFoundException,
	Param,
	Delete
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { Setting } from 'src/models/setting';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { UserSettings } from '@prisma/client';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
	constructor(private readonly settingsService: SettingsService) {}

	// @Post(':id')
	// create(@Param('id') id: number,): Promise<Setting>{
	// 	return this.settingsService.createUserSetting(id);
	// }

	@Get(':id')
	@ApiNotFoundResponse()
	async findOne(@Param('id') id: number): Promise<Setting> {
		const result = await this.settingsService.setting({ id: +id });
		if (!result) throw new NotFoundException();
		return result;
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() settingUserDto: UpdateSettingDto,
	): Promise<Setting> {
		return this.settingsService.updateUser({
			where: { id: +id },
			data: settingUserDto,
		});
	}

	@Delete(':id')
	remove(@Param('id') id: string): Promise<Setting> {
		return this.settingsService.deleteUser({ id: +id });
	}
}
