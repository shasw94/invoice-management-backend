import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { filter, Observable, of } from 'rxjs';
import { diskStorage } from 'multer';
import { OrderService } from './order.service';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { CommunicationGateway } from './communication.gateway';
import { GetOrderFilterDto } from './dto/get-order.dto';
import { Order } from './order.entity';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { minDate } from 'class-validator';
// import { Express } from 'express';

@Controller('order')
export class OrderController {
  private logger = new Logger('OrderController');
  constructor(
    private orderService: OrderService,
    private communicationGateway: CommunicationGateway,
  ) {}

  @Get('/search')
  getOrdersFilt(@Query() filterDto: GetOrderFilterDto): Promise<Order[]> {
    return this.orderService.getOrders(filterDto);
  }
  
  @Get()
  getOrders(@Paginate() query: PaginateQuery): Promise<Paginated<Order>> {
    return this.orderService.getPaginatedOrders(query);
  }

  @Get('/:id')
  getProductById(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    return this.orderService.getOrderById(id);
  }

  // @Get('/filter')
  // getOrdersDate(@Param('minDate') minDate: string, @Param('maxDate') maxDate: string) : Promise<Order[]> {

  // }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req: any, file: any, cb: any) => {
        if (path.extname(file.originalname) === '.xlsx') {
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
  uploadFile(@UploadedFile() file: Express.Multer.File): Observable<Object> {
    console.log(file);
    this.orderService.readExcelFile(file, this.communicationGateway);
    
    return of({ filePath: file.path });
  }
}
