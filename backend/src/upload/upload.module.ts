import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { UploadController } from './upload.controller';

const VALID_FOLDERS = ['courses', 'blogs', 'misc'];
const BASE_UPLOAD_PATH = join(process.cwd(), '..', 'uploads');

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: (req: any, _file: any, cb: any) => {
          const folder = String(req.params?.folder ?? 'misc');
          const dest = VALID_FOLDERS.includes(folder)
            ? join(BASE_UPLOAD_PATH, folder)
            : join(BASE_UPLOAD_PATH, 'misc');
          cb(null, dest);
        },
        filename: (_req: any, file: any, cb: any) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname).toLowerCase();
          const safeName = file.originalname
            .replace(ext, '')
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .substring(0, 50);
          cb(null, `${safeName}-${uniqueSuffix}${ext}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    }),
  ],
  controllers: [UploadController],
})
export class UploadModule {}
