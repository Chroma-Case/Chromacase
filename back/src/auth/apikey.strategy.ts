
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy, 'api-key') {
  constructor(private readonly authService: AuthService) {
    super({ header: "Authorization", prefix: "API Key " }, true, async (apikey, done) => {
        if (this.authService.validateApiKey(apikey))
          return done(null, true);
        else
          return done(new UnauthorizedException(), false);
        }
    );
  }
}
