import {
	Controller,
	Request,
	Post,
	Get,
	UseGuards,
	Body,
	Delete,
	BadRequestException,
	HttpCode,
	Put,
	InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import {
	ApiBearerAuth,
	ApiBody,
	ApiOkResponse,
	ApiParam,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '../models/user';
import { JwtToken } from './models/jwt';
import { LoginDto } from './dto/login.dto';
import { Profile } from './dto/profile.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private usersService: UsersService,
	) {}

	@Post('register')
	async register(@Body() registerDto: RegisterDto): Promise<void> {
		try {
			await this.usersService.createUser(registerDto);
		} catch {
			throw new BadRequestException();
		}
	}

	@ApiBody({ type: LoginDto })
	@HttpCode(200)
	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Request() req: any): Promise<JwtToken> {
		return this.authService.login(req.user);
	}

	@HttpCode(200)
	@Post('guest')
	async guest(): Promise<JwtToken> {
		try {
			const user = await this.usersService.createGuest();
			return this.authService.login(user);
		} catch {
			throw new BadRequestException();
		}
	}

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOkResponse({ description: 'Successfully logged in', type: User })
	@ApiUnauthorizedResponse({ description: 'Invalid token' })
	@Get('me')
	async getProfile(@Request() req: any): Promise<User> {
		const user = await this.usersService.user({ id: req.user.id });
		if (!user) throw new InternalServerErrorException();
		return user;
	}

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOkResponse({ description: 'Successfully edited profile', type: User })
	@ApiUnauthorizedResponse({ description: 'Invalid token' })
	@Put('me')
	editProfile(
		@Request() req: any,
		@Body() profile: Partial<Profile>,
	): Promise<User> {
		return this.usersService.updateUser({
			where: { id: req.user.id },
			data: {
				// If every field is present, the account is no longuer a guest profile.
				// TODO: Add some condition to change a guest account to a normal account, like require a subscription or something like that.
				isGuest:
					profile.email && profile.username && profile.password
						? false
						: undefined,
				username: profile.username,
				password: profile.password,
				email: profile.email,
			},
		});
	}

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOkResponse({ description: 'Successfully deleted', type: User })
	@ApiUnauthorizedResponse({ description: 'Invalid token' })
	@Delete('me')
	deleteSelf(@Request() req: any): Promise<User> {
		return this.usersService.deleteUser({ id: req.user.id });
	}
}
