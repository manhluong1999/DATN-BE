import { Module } from '@nestjs/common';
import { FirebaseStorageService } from './firebase-storage.service';

@Module({
  imports: [],
  controllers: [],
  providers: [FirebaseStorageService],
  exports: [FirebaseStorageService],
})
export class FirebaseStorageModule {}
