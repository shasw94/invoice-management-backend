import { EntityRepository, getConnection, Repository } from 'typeorm';
import { Store } from './store.entity';
import { CreateStoreDto } from './dto/create-Store.dto';
import { GetStoreFilterDto } from './dto/get-store.dto';
import { Product } from 'src/product/product.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

@EntityRepository(Store)
export class StoreRepository extends Repository<Store> {
  private logger = new Logger('StoreRepository');
  async createStore(createStoreDto: CreateStoreDto): Promise<Store> {
    const { name, location } = createStoreDto;

    const Store = this.create({ location });

    await this.save(Store);
    return Store;
  }

  async createOrFindStore(createStoreDto: CreateStoreDto): Promise<Store> {
    console.log('----------------------------', createStoreDto.location);
    let store = await this.findOne({ location: createStoreDto.location });
    if (!store) {
      let newStore = new Store();
      newStore.location = createStoreDto.location;
      try {
        await this.save(newStore);
        store = newStore;
        return store;
      } catch (error) {
        this.logger.log(
          `Duplicate store`,
        );
        store = await this.findOne({location: createStoreDto.location});
        return store;
      }
    }
  }

  async addProduct(product: Product, store: Store): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .relation(Store, 'products')
      .of(store)
      .add(product);
  }

  async getStores(filterDto: GetStoreFilterDto): Promise<Store[]> {
    const { search } = filterDto;

    const query = this.createQueryBuilder('store');

    if (search) {
      query.andWhere(
        'LOWER(store.name) LIKE LOWER(:search) OR LOWER(store.location) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    const Stores = await query.getMany();
    return Stores;
  }
}
