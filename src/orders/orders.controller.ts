import { Controller, Get, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './interfaces/order.interface';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get(':orderId')
  getOrder(@Param('orderId') orderId: string): Order {
    return this.ordersService.getOrderById(orderId);
  }

  @Get()
  getAllOrders(): Order[] {
    return this.ordersService.getAllOrders();
  }
}
