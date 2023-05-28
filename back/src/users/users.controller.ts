import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/models/user';

@ApiTags('users')
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

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
}
