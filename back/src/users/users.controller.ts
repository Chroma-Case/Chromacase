import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.users({});
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.user({"id": +id});
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser({where: {"id": +id}, data: updateUserDto});
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.deleteUser({"id": +id});
  }
}
