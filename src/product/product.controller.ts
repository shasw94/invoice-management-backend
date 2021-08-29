import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductFilterDto } from './dto/get-product-dto';
import { Product } from './product.entity';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  getProducts(@Query() filterDto: GetProductFilterDto): Promise<Product[]> {
    return this.productService.getProducts(filterDto);
  }

  @Get('/:id')
  getProductById(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productService.getProductById(id);
  }

  @Delete('/:id')
  deleteProduct(@Param('id') id: number): Promise<void> {
    return this.productService.deleteProduct(id);
  }

  @Patch('/:id/status')
  updateProduct(
    @Param('id') id: number,
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    const { name, rate } = createProductDto;
    return this.productService.updateProduct(id, name, rate);
  }

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.createProduct(createProductDto);
  }
}
