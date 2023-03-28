import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SettingsService } from 'src/settings/settings.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/models/user';
import { resolve } from 'path';

@ApiTags('users')
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService, private readonly settingsService: SettingsService) {}

	@Post()
	create(@Body() createUserDto: CreateUserDto): Promise<User> {
		return this.usersService.createUser(createUserDto).then((user) => {
			this.settingsService.createUserSetting(user.id);
			return user;
		}).catch((e) => e);
	}

	@Get()
	findAll(): Promise<User[]> {
		return this.usersService.users({});
	}

	@Get(':id')
	@ApiNotFoundResponse()
	async findOne(@Param('id') id: number): Promise<User> {
		const ret = await this.usersService.user({ id: +id });
		if (!ret) throw new NotFoundException();
		return ret;
	}

	@Delete(':id')
	remove(@Param('id') id: string): Promise<User> {
		return this.usersService.deleteUser({ id: +id });
	}
}
