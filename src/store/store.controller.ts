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
import { CreateStoreDto } from './dto/create-store.dto';
import { GetStoreFilterDto } from './dto/get-store.dto';
import { Store } from './store.entity';
import { StoreService } from './store.service';


@Controller('store')
export class StoreController {
    constructor(private storeService: StoreService) {}

  @Get()
  getStores(@Query() filterDto: GetStoreFilterDto): Promise<Store[]> {
    return this.storeService.getStores(filterDto);
  }

  @Get('/:id')
  getStoreById(@Param('id', ParseIntPipe) id: number): Promise<Store> {
    return this.storeService.getStoreById(id);
  }

  @Delete('/:id')
  deleteStore(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.storeService.deleteStore(id);
  }

  @Patch('/:id/status')
  updateStore(
    @Param('id', ParseIntPipe) id: number,
    @Body() createStoreDto: CreateStoreDto,
  ): Promise<Store> {
    const { name, location } = createStoreDto;
    return this.storeService.updateStore(id, name, location);
  }

  @Post()
  createStore(@Body() createStoreDto: CreateStoreDto): Promise<Store> {
    return this.storeService.createStore(createStoreDto);
  }
}
