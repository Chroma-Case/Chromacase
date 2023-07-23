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
	Patch,
	NotFoundException,
	Req,
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
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '../models/user';
import { JwtToken } from './models/jwt';
import { LoginDto } from './dto/login.dto';
import { Profile } from './dto/profile.dto';
import { Setting } from 'src/models/setting';
import { UpdateSettingDto } from 'src/settings/dto/update-setting.dto';
import { SettingsService } from 'src/settings/settings.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private usersService: UsersService,
		private settingsService: SettingsService,
	) {}

	@Get('login/google')
	@UseGuards(AuthGuard('google'))
	googleLogin() {}

	@Get('logged/google')
	@UseGuards(AuthGuard('google'))
	async googleLoginCallbakc(@Req() req: any) {
		let user = await this.usersService.user({ googleID: req.user.googleID });
		if (!user) {
			user = await this.usersService.createUser(req.user);
			await this.settingsService.createUserSetting(user.id);
		}
		return this.authService.login(user);
	}

	@Post('register')
	async register(@Body() registerDto: RegisterDto): Promise<void> {
		try {
			const user = await this.usersService.createUser(registerDto);
			await this.settingsService.createUserSetting(user.id);
		} catch (e) {
			console.error(e);
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
		const user = await this.usersService.createGuest();
		await this.settingsService.createUserSetting(user.id);
		return this.authService.login(user);
	}

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOkResponse({ description: 'The user profile picture' })
	@ApiUnauthorizedResponse({ description: 'Invalid token' })
	@Get('me/picture')
	async getProfilePicture(@Request() req: any) {
		return await this.usersService.getProfilePicture(req.user.id);
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

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOkResponse({ description: 'Successfully edited settings', type: Setting })
	@ApiUnauthorizedResponse({ description: 'Invalid token' })
	@Patch('me/settings')
	udpateSettings(
		@Request() req: any,
		@Body() settingUserDto: UpdateSettingDto,
	): Promise<Setting> {
		return this.settingsService.updateUserSettings({
			where: { userId: +req.user.id },
			data: settingUserDto,
		});
	}

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOkResponse({ description: 'Successfully edited settings', type: Setting })
	@ApiUnauthorizedResponse({ description: 'Invalid token' })
	@Get('me/settings')
	async getSettings(@Request() req: any): Promise<Setting> {
		const result = await this.settingsService.getUserSetting({
			userId: +req.user.id,
		});
		if (!result) throw new NotFoundException();
		return result;
	}
}
