import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  Param,
  UseGuards,
  Get,
  Delete,
  Query,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync, readdirSync, unlinkSync } from 'fs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// ─── Allowed file types ────────────────────────────────────────────────────
const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|webp|gif)$/i;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// ─── Valid upload folders ──────────────────────────────────────────────────
const VALID_FOLDERS = ['courses', 'blogs', 'misc'];
const BASE_UPLOAD_PATH = join(process.cwd(), '..', 'uploads');

// ─── Multer file filter ────────────────────────────────────────────────────
function imageFileFilter(_req: any, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestException('Invalid file type. Allowed: JPG, PNG, WebP, GIF'), false);
  }
}

@Controller('api/upload')
export class UploadController {
  private readonly baseUrl = process.env.BASE_URL || 'https://expertalkzglobalsolutions.in';

  // ─── POST /api/upload/:folder ─────────────────────────────────────────
  // Upload a single image to the specified folder (requires login)
  @Post(':folder')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: imageFileFilter,
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  uploadSingle(
    @UploadedFile() file: Express.Multer.File,
    @Param('folder') folder: string,
  ) {
    if (!VALID_FOLDERS.includes(folder)) {
      throw new BadRequestException(`Invalid folder. Valid options: ${VALID_FOLDERS.join(', ')}`);
    }
    if (!file) {
      throw new BadRequestException('No file uploaded. Use multipart/form-data with field name "file"');
    }

    const url = `${this.baseUrl}/uploads/${folder}/${file.filename}`;
    return {
      success: true,
      url,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      folder,
    };
  }

  // ─── POST /api/upload/:folder/multiple ───────────────────────────────
  // Upload up to 10 images at once
  @Post(':folder/multiple')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      fileFilter: imageFileFilter,
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('folder') folder: string,
  ) {
    if (!VALID_FOLDERS.includes(folder)) {
      throw new BadRequestException(`Invalid folder. Valid options: ${VALID_FOLDERS.join(', ')}`);
    }
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded.');
    }

    const uploaded = files.map((file) => ({
      url: `${this.baseUrl}/uploads/${folder}/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
    }));

    return { success: true, folder, count: files.length, files: uploaded };
  }

  // ─── GET /api/upload/:folder ──────────────────────────────────────────
  // List all images in a folder
  @Get(':folder')
  @UseGuards(JwtAuthGuard)
  listFiles(@Param('folder') folder: string) {
    if (!VALID_FOLDERS.includes(folder)) {
      throw new BadRequestException(`Invalid folder. Valid options: ${VALID_FOLDERS.join(', ')}`);
    }

    const dir = join(BASE_UPLOAD_PATH, folder);
    if (!existsSync(dir)) return { files: [] };

    const files = readdirSync(dir)
      .filter((f) => IMAGE_EXTENSIONS.test(f))
      .map((filename) => ({
        filename,
        url: `${this.baseUrl}/uploads/${folder}/${filename}`,
      }));

    return { folder, count: files.length, files };
  }

  // ─── DELETE /api/upload/:folder?filename=xxx ─────────────────────────
  // Delete a specific file
  @Delete(':folder')
  @UseGuards(JwtAuthGuard)
  deleteFile(@Param('folder') folder: string, @Query('filename') filename: string) {
    if (!VALID_FOLDERS.includes(folder)) {
      throw new BadRequestException('Invalid folder.');
    }
    if (!filename || filename.includes('..') || filename.includes('/')) {
      throw new BadRequestException('Invalid filename.');
    }

    const filePath = join(BASE_UPLOAD_PATH, folder, filename);
    if (!existsSync(filePath)) {
      throw new BadRequestException('File not found.');
    }

    unlinkSync(filePath);
    return { success: true, message: `Deleted: ${folder}/${filename}` };
  }
}
