import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { filter, Observable, of } from 'rxjs';
import { diskStorage } from 'multer';
import { OrderService } from './order.service';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
// import { Express } from 'express';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req: any, file: any, cb: any) => {
        if (path.extname(file.originalname) === ".xlsx") {
          cb(null, true);
        } else {
          cb(
            new HttpException(
              `Unsupported file type ${path.extname(file.originalname)}`,
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
      },
      storage: diskStorage({
        destination: './files/invoices',
        filename: (req, file, cb) => {
          const filename: string =
            path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
          const extension: string = path.parse(file.originalname).ext;

          cb(null, `${filename}${extension}`);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file :Express.Multer.File): Observable<Object> {
    this.orderService.readExcelFile(file);
    return of({ filePath: file.path });
  }
}
