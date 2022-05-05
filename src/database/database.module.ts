import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'src/@core/config/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => {
        const { mongo } = config;
        const { username, password, database, host } = mongo;
        return {
          uri: `mongodb+srv://${username}:${password}@${host}`,
          dbName: database,
        };
      },
      inject: [],
    }),
  ],
})
export class DatabaseModule {}
