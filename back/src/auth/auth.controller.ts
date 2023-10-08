import {
	Controller,
	Request,
	Post,
	Get,
	UseGuards,
	Body,
	Delete,
	BadRequestException,
	ConflictException,
	HttpCode,
	Put,
	InternalServerErrorException,
	Patch,
	NotFoundException,
	Req,
	UseInterceptors,
	UploadedFile,
	HttpStatus,
	ParseFilePipeBuilder,
	Response,
	Param,
	Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiBody,
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiNoContentResponse,
	ApiOkResponse,
	ApiOperation,
	ApiResponse,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { writeFile } from 'fs';

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
	@ApiOperation({description: 'Redirect to google login page'})
	googleLogin() {}

	@Get('logged/google')
	@ApiOperation({description: 'Redirect to the front page after connecting to the google account'})
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
	@ApiOperation({description: 'Register a new user'})
	@ApiConflictResponse({ description: 'Username or email already taken' })
	@ApiOkResponse({ description: 'Successfully registered, email sent to verify' })
	@ApiBadRequestResponse({ description: 'Invalid data or database error' })
	async register(@Body() registerDto: RegisterDto): Promise<void> {
		try {
			const user = await this.usersService.createUser(registerDto);
			await this.settingsService.createUserSetting(user.id);
			await this.authService.sendVerifyMail(user);
		} catch (e) {
			// check if the error is a duplicate key error
			if (e.code === 'P2002') {
				throw new ConflictException('Username or email already taken');
			}
			console.error(e);
			throw new BadRequestException();
		}
	}

	@Put('verify')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	@ApiOperation({description: 'Verify the email of the user'})
	@ApiOkResponse({ description: 'Successfully verified' })
	@ApiBadRequestResponse({ description: 'Invalid or expired token' })
	async verify(@Request() req: any, @Query('token') token: string): Promise<void> {
		if (await this.authService.verifyMail(req.user.id, token))
			return;
		throw new BadRequestException("Invalid token. Expired or invalid.");
	}

	@Put('reverify')
	@UseGuards(JwtAuthGuard)
	@HttpCode(200)
	@ApiOperation({description: 'Resend the verification email'})
	async reverify(@Request() req: any): Promise<void> {
		const user = await this.usersService.user({ id: req.user.id });
		if (!user) throw new BadRequestException("Invalid user");
		await this.authService.sendVerifyMail(user);
	}

	@Post('login')
	@HttpCode(200)
	@UseGuards(LocalAuthGuard)
	@ApiBody({ type: LoginDto })
	@ApiOperation({ description: 'Login with username and password' })
	@ApiOkResponse({ description: 'Successfully logged in', type: JwtToken })
	@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
	async login(@Request() req: any): Promise<JwtToken> {
		return this.authService.login(req.user);
	}

	@Post('guest')
	@HttpCode(200)
	@ApiOperation({ description: 'Login as a guest account' })
	@ApiOkResponse({ description: 'Successfully logged in', type: JwtToken })
	async guest(): Promise<JwtToken> {
		const user = await this.usersService.createGuest();
		await this.settingsService.createUserSetting(user.id);
		return this.authService.login(user);
	}

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({ description: 'Get the profile picture of connected user' })
	@ApiOkResponse({ description: 'The user profile picture' })
	@ApiUnauthorizedResponse({ description: 'Invalid token' })
	@Get('me/picture')
	async getProfilePicture(@Request() req: any, @Response() res: any) {
		return await this.usersService.getProfilePicture(req.user.id, res);
	}

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOkResponse({ description: 'The user profile picture' })
	@ApiUnauthorizedResponse({ description: 'Invalid token' })
	@Post('me/picture')
	@ApiOperation({ description: 'Upload a new profile picture' })
	@UseInterceptors(FileInterceptor('file'))
	async postProfilePicture(
		@Request() req: any,
		@UploadedFile(
			new ParseFilePipeBuilder()
				.addFileTypeValidator({
					fileType: 'jpeg',
				})
				.build({
					errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
				}),
		)
		file: Express.Multer.File,
	) {
		const path = `/data/${req.user.id}.jpg`;
		writeFile(path, file.buffer, (err) => {
			if (err) throw err;
		});
	}

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOkResponse({ description: 'Successfully logged in', type: User })
	@ApiUnauthorizedResponse({ description: 'Invalid token' })
	@Get('me')
	@ApiOperation({ description: 'Get the user info of connected user' })
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
	@ApiOperation({ description: 'Edit the profile of connected user' })
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
	@ApiOperation({ description: 'Delete the profile of connected user' })
	deleteSelf(@Request() req: any): Promise<User> {
		return this.usersService.deleteUser({ id: req.user.id });
	}

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOkResponse({ description: 'Successfully edited settings', type: Setting })
	@ApiUnauthorizedResponse({ description: 'Invalid token' })
	@Patch('me/settings')
	@ApiOperation({ description: 'Edit the settings of connected user' })
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
	@ApiOperation({ description: 'Get the settings of connected user' })
	async getSettings(@Request() req: any): Promise<Setting> {
		const result = await this.settingsService.getUserSetting({
			userId: +req.user.id,
		});
		if (!result) throw new NotFoundException();
		return result;
	}

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOkResponse({ description: 'Successfully added liked song'})
	@ApiUnauthorizedResponse({ description: 'Invalid token' })
	@Post('me/likes/:id')
	addLikedSong(
		@Request() req: any,
		@Param('id') songId: number
	) {
		return this.usersService.addLikedSong(
			+req.user.id,
			+songId,
		);
	}

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOkResponse({ description: 'Successfully removed liked song'})
	@ApiUnauthorizedResponse({ description: 'Invalid token' })
	@Delete('me/likes/:id')
	removeLikedSong(
		@Request() req: any,
		@Param('id') songId: number,
	) {
		return this.usersService.removeLikedSong(
			+req.user.id,
			+songId,
		);
	}

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOkResponse({ description: 'Successfully retrieved liked song'})
	@ApiUnauthorizedResponse({ description: 'Invalid token' })
	@Get('me/likes')
	getLikedSongs(
		@Request() req: any,
	) {
		return this.usersService.getLikedSongs(+req.user.id)
	}

	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOkResponse({ description: 'Successfully added score'})
	@ApiUnauthorizedResponse({ description: 'Invalid token' })
	@Patch('me/score/:score')
	addScore(
		@Request() req: any,
		@Param('id') score: number,
	) {
		return this.usersService.addScore(
				+req.user.id,
				score,
			);
	}
}
