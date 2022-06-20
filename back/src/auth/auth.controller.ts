import { Controller, Request, Post, Get, UseGuards, Res, Body, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { ApiBearerAuth, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private usersService: UsersService,
		private configService: ConfigService
	) {}

	@Post('register')
	async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
		try {
			await this.usersService.createUser(registerDto);
			return res.status(200).json({"status": "user created"});
		} catch {
			return res.status(400).json({"status": "user not created"});
		}
	}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Request() req) {
		return this.authService.login(req.user);
	}

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOkResponse({ description: 'Successfully logged in' })
	@ApiUnauthorizedResponse({ description: 'Invalid token' })
	@Get('me')
	getProfile(@Request() req) {
  		return req.user;
  	}

  	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOkResponse({ description: 'Successfully deleted' })
	@ApiUnauthorizedResponse({ description: 'Invalid token' })
	@Delete('me')
	deleteSelf(@Request() req) {
      return this.usersService.deleteUser({"id": req.user.id})
  	}

}
