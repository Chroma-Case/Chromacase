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

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOkResponse({ description: 'Successfully logged in', type: User })
	@ApiUnauthorizedResponse({ description: 'Invalid token' })
	@Get('me')
	getProfile(@Request() req: any): User {
		return req.user;
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
