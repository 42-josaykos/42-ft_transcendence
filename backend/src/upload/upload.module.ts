import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from './upload.controller';

@Module({
  imports: [
    MulterModule.register({
      dest: '../',
      limits: { fileSize: 10000000 },
    }),
  ],
  controllers: [UploadController],
})
export class UploadModule {}
