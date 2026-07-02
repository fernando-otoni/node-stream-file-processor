import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer'
import { UploadService } from "src/modules/upload/service/upload.service";

export interface IFile extends Express.Multer.File {
  fieldname: string
  originalname: string
  enconding: string
  mimetype: string
  destination: string
  filename: string
  path: string
  size: number
}

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './upload',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`

          cb(null, filename)
        }
      })
    }))
  async upload(
    @UploadedFile()
    file: IFile
  ) {
    await this.uploadService.processFile(file)

    return {
      message: 'Upload success',
      filename: file.filename
    }
  }
}