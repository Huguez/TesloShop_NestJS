import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import type { Response } from "express"
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/file-filter';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/file-namer';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {

   constructor(
      private readonly filesService: FilesService,
      private readonly configService: ConfigService,
   ) { }

   @Post('product')
   @UseInterceptors(FileInterceptor('file', {
      fileFilter: fileFilter,
      // limits: { fileSize: 1000 },
      storage: diskStorage({
         destination: "./static/uploads",
         filename: fileNamer,
      })
   }))
   uploadFile(@UploadedFile() file: Express.Multer.File) {

      if (!file) {
         throw new BadRequestException("Make sure that file is in request");
      }

      const secureUrl = `${ this.configService.get( "HOST_API" ) }/files/product/${ file.filename }`

      return {
         secureUrl
      }
   }

   @Get("product/:imageName")
   findOne(@Res() res: Response, @Param("imageName") imageName: string) {
      const path = this.filesService.getStaticProductImage(imageName)

      return res.sendFile(path)
   }


}
