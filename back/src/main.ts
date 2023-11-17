import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
	ValidationPipe,
} from '@nestjs/common';
import { RequestLogger, RequestLoggerOptions } from 'json-logger-service';
import { tap } from 'rxjs';
import { PrismaModel } from './_gen/prisma-class';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AspectLogger implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler) {
		const req = context.switchToHttp().getRequest();
		const res = context.switchToHttp().getResponse();
		const { statusCode } = context.switchToHttp().getResponse();
		const { originalUrl, method, params, query, body, user } = req;

		const toPrint = {
			originalUrl,
			method,
			params,
			query,
			body,
			userId: user?.id ?? 'not logged in',
			username: user?.username ?? 'not logged in',
		};

		return next.handle().pipe(
			tap((/* data */) =>
				console.log(
					JSON.stringify({
						...toPrint,
						statusCode,
						//data, //TODO: Data crashed with images
					}),
				),),
		);
	}
}

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(
		RequestLogger.buildExpressRequestLogger({
			doNotLogPaths: ['/health'],
		} as RequestLoggerOptions),
	);
	app.enableShutdownHooks();

	const config = new DocumentBuilder()
		.setTitle('Chromacase')
		.setDescription('The chromacase API')
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, config, {
		extraModels: [...PrismaModel.extraModels],
	});
	SwaggerModule.setup('api', app, document);

	app.useGlobalPipes(new ValidationPipe());
	app.enableCors();
	//app.useGlobalInterceptors(new AspectLogger());

	await app.listen(3000);
}
bootstrap();
