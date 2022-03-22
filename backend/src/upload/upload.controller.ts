import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';

// Path to where store avatars
const avatarFolder = 'assets/avatars';

// Reference: https://github.com/expressjs/multer
const avatarMulterOptions: MulterOptions = {
  storage: diskStorage({
    destination: avatarFolder,
    filename: (req, file, cb) => {
      cb(null, generateFilename(file));
    },
  }),
  limits: {
    fileSize: 5000000, // 5MB
  },
};

// Should generate a name corresponding to the ID of the logged User (as username can change)
function generateFilename(file: Express.Multer.File): string {
  return file.originalname;
}

@Controller('upload')
@ApiTags('upload')
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
    console.log('[UploadModule] Avatar uploaded:');
    console.log(file);
  }
}

@Controller('assets')
@ApiTags('upload')
export class AssetsController {
  // Reference: https://docs.nestjs.com/techniques/streaming-files
  // Could also be done via Express with 'sendFile': https://www.techiediaries.com/nestjs-upload-serve-static-file/
  @Get('avatars/:filename')
  getAvatar(
    @Param('filename') filename: string,
    @Res({ passthrough: true }) response,
  ): StreamableFile {
    // Join avatar path and throw error if file does not exists
    const filePath = join(process.cwd(), avatarFolder, filename);
    if (!existsSync(filePath))
      throw new NotFoundException('Avatar does not exists');

    // 'Content-Disposition: inline' is necessary if we want to show the image, and not download it
    // 'Content-Type: image' is also necessary so that the browser knows what we send
    response.set({ 'Content-Disposition': 'inline', 'Content-Type': 'image' });

    const avatar = createReadStream(filePath);
    return new StreamableFile(avatar);
  }
}
