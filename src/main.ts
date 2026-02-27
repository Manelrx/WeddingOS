import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        bodyParser: true,
        rawBody: true,
    });

    // Increase body parser limits for large file uploads
    const expressApp = app.getHttpAdapter().getInstance();
    const bodyParser = require('body-parser');
    expressApp.use(bodyParser.json({ limit: '50mb' }));
    expressApp.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    expressApp.use(bodyParser.raw({ limit: '50mb', type: 'application/octet-stream' }));

    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.use(cookieParser());
    app.enableCors({
        origin: true,
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
    });
    // Listen on 0.0.0.0 for Docker compatibility
    await app.listen(process.env.PORT || 3000, '0.0.0.0');
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();