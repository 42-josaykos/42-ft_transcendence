import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('upload')
export class UploadController {
  @Get()
  helloWorld() {
    return 'Hello! This the upload module. Do a POST request on this path to upload a file';
  }

  @Post()
  @UseInterceptors(FileInterceptor('avatarUpload'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('Avatar uploaded:');
    console.log(file);
  }
}
