import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class Constants {

	constructor(private configService: ConfigService) {}

	getSecret = () => {
		return this.configService.get("JWT_SECRET");
	}
}