import { CloudStorageService } from './cloud-storage.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [CloudStorageService],
  exports: [CloudStorageService],
})
export class CloudStorageModule {}
