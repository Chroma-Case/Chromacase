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

	@Get(':userid')
	@ApiNotFoundResponse()
	async findOne(@Param('userid') id: number): Promise<Setting> {
		const result = await this.settingsService.setting({ userId: +id });
		if (!result) throw new NotFoundException();
		return result;
	}

	@Patch(':userid')
	update(
		@Param('userid') id: string,
		@Body() settingUserDto: UpdateSettingDto,
	): Promise<Setting> {
		return this.settingsService.updateUser({
			where: { userId: +id },
			data: settingUserDto,
		});
	}

	// @Delete(':userid')
	// remove(@Param('userid') id: string): Promise<Setting> {
	// 	return this.settingsService.deleteUser({ userId: +id });
	// }
}
