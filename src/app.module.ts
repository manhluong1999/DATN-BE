import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RouterModule } from 'nest-router';
import { ROUTERS } from './@core/config';
import { initFirebase } from './@core/config/firebase-config';
import { HttpErrorFilter } from './@core/filters';
import { LoggingInterceptor } from './@core/interceptors';
import { AppGateway } from './modules/gateways/app.gateway';
import { DatabaseModule } from './database/database.module';
import { MODULES } from './modules';

console.log('API DOCS: http://localhost:4000/api');

initFirebase();
@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        MONGO_USERNAME: Joi.string().required(),
        MONGO_PASSWORD: Joi.string().required(),
        MONGO_DATABASE: Joi.string().required(),
        MONGO_HOST: Joi.string().required(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    RouterModule.forRoutes(ROUTERS),
    DatabaseModule,
    ...MODULES,
  ],
  controllers: [],
  providers: [
    AppGateway,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
