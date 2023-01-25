import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const prismaService = app.get(PrismaService);
	await prismaService.enableShutdownHooks(app);

	const config = new DocumentBuilder()
		.setTitle('Chromacase')
		.setDescription('The chromacase API')
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	app.useGlobalPipes(new ValidationPipe());
	app.enableCors();
	await app.listen(3000);
}
bootstrap();
