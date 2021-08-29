import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import {
  FilterOperator,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { join } from 'path/posix';
import { Brand } from 'src/brand/brand.entity';
import { BrandRepository } from 'src/brand/brand.repository';
import { CreateBrandDto } from 'src/brand/dto/create-brand.dto';
import { CreateProductDto } from 'src/product/dto/create-product.dto';
import { GetProductFilterDto } from 'src/product/dto/get-product-dto';
import { Product } from 'src/product/product.entity';
import { ProductRepository } from 'src/product/product.repository';
import { CreateStoreDto } from 'src/store/dto/create-Store.dto';
import { Store } from 'src/store/store.entity';
import { StoreRepository } from 'src/store/store.repository';
import { getConnection } from 'typeorm';
import * as XLSX from 'xlsx';
import { CommunicationGateway } from './communication.gateway';
import {
  CreateOrderDto,
  CreateOrderToProductDto,
} from './dto/create-order.dto';
import { GetOrderFilterDto } from './dto/get-order.dto';
import { ReadRowOrderDto } from './dto/read-row-order.dto';
import { Order } from './order.entity';
import { OrderToProductRepository } from './order.product.repository';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
  private logger = new Logger('OrderServiceLogger');
  constructor(
    @InjectRepository(OrderRepository)
    private orderRepository: OrderRepository,

    @InjectRepository(BrandRepository)
    private brandRepository: BrandRepository,

    @InjectRepository(StoreRepository)
    private storeRepository: StoreRepository,

    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,

    @InjectRepository(OrderToProductRepository)
    private orderToProductRepository: OrderToProductRepository,
  ) {}

  createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderRepository.createOrder(createOrderDto);
  }

  async getOrderById(id: number): Promise<Order> {
    const found = await this.orderRepository.findOne(id, {
    relations: ["orderToProduct", "orderToProduct.product", "orderToProduct.product.brand"]
    });
    if (!found) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
    return found;
  }

  async deleteOrder(id: number): Promise<void> {
    const result = await this.orderRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async updateOrder(
    id: number,
    createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    const order = await this.getOrderById(id);

    order.date = createOrderDto.date;
    order.orderNumber = createOrderDto.orderNumber;

    await this.orderRepository.save(order);

    return order;
  }

  getOrders(filterDto: GetOrderFilterDto): Promise<Order[]> {
    return this.orderRepository.getOrders(filterDto);
  }

  async getPaginatedOrders(query: PaginateQuery): Promise<Paginated<Order>> {
    return paginate(query, this.orderRepository, {
      sortableColumns: ['id', 'orderNumber', 'date'],
      searchableColumns: ['id', 'orderNumber', 'date'],
      defaultSortBy: [['id', 'DESC']],
      filterableColumns: {
        date: [FilterOperator.GTE, FilterOperator.EQ, FilterOperator.LTE],
      },
    });
  }

  async createOrFindProduct(name: string, rate: number): Promise<Product> {
    const createDto = new CreateProductDto();
    createDto.name = name;
    createDto.rate = rate;
    return this.productRepository.createOrFindProduct(createDto);
  }

  async createOrFindStore(location: string): Promise<Store> {
    const createDto = new CreateStoreDto();
    createDto.location = location;
    return this.storeRepository.createOrFindStore(createDto);
  }

  async createOrFindBrand(name: string): Promise<Brand> {
    const createDto = new CreateBrandDto();
    createDto.name = name;
    return this.brandRepository.createOrFindBrand(createDto);
  }

  async readExcelFile(
    file: Express.Multer.File,
    communicationGateway: CommunicationGateway,
  ) {
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
    let errorOrders = [];
    let successOrders = [];
    const valid = await Promise.all(
      data.map(async (row, rowNum) => {
        let flag = false;
        const dto = new ReadRowOrderDto();
        dto.brand = row['Brand'].replace(/\s+/g, ' ').trim();
        dto.date = row['Date'].replace(/\s+/g, ' ').trim();
        dto.location = row['Location'].replace(/\s+/g, ' ').trim();
        dto.orderNumber = row['Order Number'];
        dto.product = row['Product'].replace(/\s+/g, ' ').trim();
        dto.quantity = row['Quantity'];
        dto.rate = row['Rate '];
        dto.totalAmountPaid = row['Gross Amount'];

        const errs = await validate(dto);
        if (errs && errs.length > 0) {
          errorOrders.push({ order: dto, errors: errs });
          return false;
        }

        try {
          const product = await this.createOrFindProduct(dto.product, dto.rate);
          const store = await this.createOrFindStore(dto.location);
          const brand = await this.createOrFindBrand(dto.brand);
          try {
            // await this.productRepository.addStore(store, product);
            await this.productRepository.addBrand(brand, product);
          } catch (error) {
            this.logger.error(`Add error: ${error}`);
          }
          // await this.brandRepository.addProduct(product, brand);
          const searchDto = new GetOrderFilterDto();
          searchDto.orderNumber = dto.orderNumber;

          let orders = await this.getOrders(searchDto);

          let order: Order;

          if (orders && orders.length === 0) {
            try {
              const orderDto = new CreateOrderDto();
              orderDto.date = dto.date;
              orderDto.orderNumber = dto.orderNumber;
              order = await this.createOrder(orderDto);
            } catch (error) {
              orders = await this.getOrders(searchDto);
              order = orders[0];
            }
          } else {
            order = orders[0];
          }
          const createOrderProdDto = new CreateOrderToProductDto();
          createOrderProdDto.orderId = order.id;
          createOrderProdDto.location = dto.location;
          createOrderProdDto.productId = product.id;
          createOrderProdDto.quantity = dto.quantity;
          createOrderProdDto.totalAmountPaid = dto.totalAmountPaid;
          await this.orderToProductRepository.createOrderToProduct(
            createOrderProdDto,
          );
          successOrders.push({ order: order });
          return true;
        } catch (error) {
          this.logger.error(`Error caught ${JSON.stringify(error)}`);
          return true;
        }
      }),
    );
    this.logger.debug(
      `success: ${successOrders.length} failures: ${errorOrders.length}`,
    );

    if (!valid) {
      communicationGateway.server.emit('message', {
        type: 'error',
        order: errorOrders,
        count: errorOrders.length,
      });
      return;
    }
    communicationGateway.server.emit('message', {
      type: 'success',
      order: successOrders,
      count: successOrders.length,
    });

    return data;
  }
}
