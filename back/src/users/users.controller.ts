import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/models/user';

@ApiTags('users')
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	create(@Body() createUserDto: CreateUserDto): Promise<User> {
		return this.usersService.createUser(createUserDto);
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

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateUserDto: UpdateUserDto,
	): Promise<User> {
		return this.usersService.updateUser({
			where: { id: +id },
			data: updateUserDto,
		});
	}

	@Delete(':id')
	remove(@Param('id') id: string): Promise<User> {
		return this.usersService.deleteUser({ id: +id });
	}
}
