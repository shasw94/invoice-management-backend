import { EntityRepository, Repository } from "typeorm";
import { CreateOrderDto } from "./dto/create-order.dto";
import { GetOrderFilterDto } from "./dto/get-order.dto";
import { Order } from "./order.entity";

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
    async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
        const { date, orderNumber } = createOrderDto;
    
        const order = this.create({ date, orderNumber });
    
        await this.save(order);
        return order;
      }
    
      async getOrders(filterDto: GetOrderFilterDto): Promise<Order[]> {
        const { date, orderNumber, minDateRange, maxDateRange } = filterDto;
    
        const query = this.createQueryBuilder('order');
    
        if (date) {
          query.andWhere('order.date =:date', { date });
        }
    
        if (orderNumber) {
          query.andWhere('order.orderNumber = :orderNumber', {orderNumber});
        }

        if (minDateRange) {
            query.andWhere('order.date >= :minDateRange', {minDateRange});
        }

        if (maxDateRange) {
            query.andWhere('order.date <= :maxDateRange', {maxDateRange});
        }
    
        const orders = await query.leftJoinAndSelect('order.orderToProduct', "orderToProduct").leftJoinAndSelect('orderToProduct.product', 'product').leftJoinAndSelect('product.brand', 'brand').getMany();
        return orders;
      }
}