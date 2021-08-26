import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import * as XLSX from 'xlsx';
import { CommunicationGateway } from './communication.gateway';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrderFilterDto } from './dto/get-order.dto';
import { ReadRowOrderDto } from './dto/read-row-order.dto';
import { Order } from './order.entity';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderRepository)
    private orderRepository: OrderRepository,
  ) {}

  createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderRepository.createOrder(createOrderDto);
  }

  async getOrderById(id: string): Promise<Order> {
    const found = await this.orderRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
    return found;
  }

  async deleteOrder(id: string): Promise<void> {
    const result = await this.orderRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async updateOrder(
    id: string,
    createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    const order = await this.getOrderById(id);

    order.date = createOrderDto.date;
    order.orderNumber = createOrderDto.orderNumber;
    order.quantity = createOrderDto.quantity;
    order.totalAmountPaid = createOrderDto.totalAmountPaid;

    await this.orderRepository.save(order);

    return order;
  }

  getOrders(filterDto: GetOrderFilterDto): Promise<Order[]> {
    return this.orderRepository.getOrders(filterDto);
  }

  checkRowAndUpload(readRowOrderDto: ReadRowOrderDto) {

  }

  readExcelFile(file: Express.Multer.File, communicationGateway: CommunicationGateway) {
    const workbook: XLSX.WorkBook = XLSX.readFile(file.path);
    const sheetnames = Object.keys(workbook.Sheets);
    const check = sheetnames.includes('Data');
    if (!check) {
      throw new HttpException(
        'Sheet named Data does not exist. Please upload excel file in correct format.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const data = XLSX.utils.sheet_to_json(workbook.Sheets['Data']);
    let count = 0;
    data.map((row, rowNum) => {
      const dto = new ReadRowOrderDto();
      dto.brand = row["Brand"];
      dto.date = row["Date"];
      dto.location = row["Location"];
      dto.orderNumber = row["Order Number"];
      dto.product = row["Product"];
      dto.quantity = row["Quantity"]
      dto.rate = row["Rate"];
      dto.totalAmountPaid = row["Gross Amount"];
      validate(dto).then(errs => {
        if (errs && errs.length > 0) {
          communicationGateway.server.emit("error", row);
        } else {
          communicationGateway.server.emit("success", ++count);
        }
      })
    })
    return data;
  }
}
