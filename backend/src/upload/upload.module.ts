import { Module } from '@nestjs/common';
import { AssetsController, UploadController } from './upload.controller';

@Module({
  imports: [],
  controllers: [UploadController, AssetsController],
  providers: [],
})
export class UploadModule {}
