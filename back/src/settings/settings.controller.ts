import {
	Controller,
	Get,
	Patch,
	Body,
	NotFoundException,
	Param,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { Setting } from 'src/models/setting';
import { UpdateSettingDto } from './dto/update-setting.dto';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
	constructor(private readonly settingsService: SettingsService) {}

	@Get(':userid')
	@ApiNotFoundResponse()
	async findOne(@Param('userid') id: number): Promise<Setting> {
		const result = await this.settingsService.getUserSetting({ userId: +id });
		if (!result) throw new NotFoundException();
		return result;
	}

	@Patch(':userid')
	update(
		@Param('userid') id: string,
		@Body() settingUserDto: UpdateSettingDto,
	): Promise<Setting> {
		return this.settingsService.updateUserSettings({
			where: { userId: +id },
			data: settingUserDto,
		});
	}
}
