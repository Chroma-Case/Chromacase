import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiOkResponse } from "@nestjs/swagger";

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	@ApiOkResponse({
		description: "Return a hello world message, used as a health route",
	})
	getHello(): string {
		return this.appService.getHello();
	}
}
