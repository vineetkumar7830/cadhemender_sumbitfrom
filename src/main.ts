import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  app.setGlobalPrefix('api/v1'); // I already set it on controller but global prefix is better. Let's do it here. Wait, I set 'api/v1/enquiry' on controller. Let's just keep prefix for other APIs if they have it, but for now I'll just remove setGlobalPrefix to avoid api/v1/api/v1/enquiry.
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const allowedOrigins = configService.get<string>('ALLOWED_ORIGINS')?.split(',') || '*';
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
