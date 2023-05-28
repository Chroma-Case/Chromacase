// users/google/google.strategy.ts

import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "src/auth/auth.service";

// La classe GoogleStrategy étend PassportStrategy et utilise la stratégie passport-google-oauth20
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
    constructor(
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
    ) {
        // Initialize the Google OAuth2.0 strategy with the appropriate credentials
        super({
            clientID: configService.get("GOOGLE_CLIENT_ID"),
            clientSecret: configService.get("GOOGLE_CLIENT_SECRET"),
            callbackURL: configService.get("GOOGLE_CALLBACK_URI"),
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
            const { emails, name, photos, id } = profile; // Extract the relevant information from the profile object
            const user = await this.usersService.findOrCreate({
                email: emails[0].value,
                firstName: name.givenName,
                lastName: name.familyName,
                picture: photos[0].value,
                googleId: id,
            });
            //console.log(profile.id + " & " + user.googleId)
            const jwt = await this.authService.login(user);
            return {user, jwt};
        } catch (err) {
            console.error(err);
            throw new InternalServerErrorException();
        }
    }
}