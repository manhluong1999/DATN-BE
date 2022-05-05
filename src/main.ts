import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { config } from './@core/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configSwagger = new DocumentBuilder()
    .setTitle('DATN example')
    .setDescription('DATN-BE API description')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
      )
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  await app.listen(config.api.port);
}
bootstrap();
