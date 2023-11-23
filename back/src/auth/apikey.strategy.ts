
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-headerapikey';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class HeaderApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
    constructor(
        private readonly configService: ConfigService
    ) {
        super({ header: 'Authorization', prefix: 'API Key ' },
        true,
        async (apiKey, done) => {
            return this.validate(apiKey, done);
        });
    }

    public validate = (apiKey: string, done: (error: Error, data) => {}) => {
        if (this.configService.get<string>('API_KEYS')?.split(',').includes(apiKey)) {
          //@ts-expect-error
            done(null, true);
        }
        done(new UnauthorizedException(), null);
    }
}