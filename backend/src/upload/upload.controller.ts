import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';

// Reference: https://github.com/expressjs/multer
const avatarMulterOptions: MulterOptions = {
  storage: diskStorage({
    destination: 'assets/avatars',
    filename: (req, file, cb) => {
      cb(null, generateFilename(file));
    },
  }),
  limits: {
    fileSize: 5000000, // 5MB
  },
};

function generateFilename(file: Express.Multer.File): string {
  return file.originalname;
}

@Controller('upload')
export class UploadController {
  @Get()
  helloWorld() {
    return 'Hello! This the upload module. Do a POST request on this path to upload a file. Content-Type (enctype) must be "multipart/form-data"';
  }

  // The HTML upload form MUST have the same 'name' field value as here: 'avatarUpload'
  // That is how NestJS determines which file to intercept
  // Reference: https://docs.nestjs.com/techniques/file-upload
  @Post()
  @UseInterceptors(FileInterceptor('avatarUpload', avatarMulterOptions))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('Avatar uploaded:');
    console.log(file);
  }
}
