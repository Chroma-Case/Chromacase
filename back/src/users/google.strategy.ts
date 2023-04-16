// users/google/google.strategy.ts

import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ConfigService } from "@nestjs/config";

// La classe GoogleStrategy étend PassportStrategy et utilise la stratégie passport-google-oauth20
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
    constructor(
        private readonly usersService: UsersService,
        private readonly configService: ConfigService
    ) {
        // Initialize the Google OAuth2.0 strategy with the appropriate credentials
        super({
            clientID: configService.get("GOOGLE_CLIENT_ID"),
            clientSecret: configService.get("GOOGLE_CLIENT_SECRET"),
            callbackURL: configService.get("GOOGLE_CALLBACK_URL"),
            scope: ["email", "profile"],
        });
    }

    // The validate method is called by Passport after the user has been authenticated
    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
    ): Promise<any> {
        try {
            const { email, name, picture } = profile; // Extract the relevant information from the profile object
            const user = await this.usersService.findOrCreate({
                email: email[0].value,
                firstName: name.givenName,
                lastName: name.familyName,
                picture: picture[0].value,
                accessToken,
            });
            return user;
        } catch (err) {
            console.log(err);
            throw new InternalServerErrorException();
        }
    }
}