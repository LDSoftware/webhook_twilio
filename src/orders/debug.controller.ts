import { Controller, Get, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('debug')
export class DebugController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('orders')
  async debugOrders() {
    // Ver qué hay en la base de datos
    const orders = await this.ordersService['orderModel'].find().limit(5).exec();
    
    return {
      count: await this.ordersService['orderModel'].countDocuments(),
      useOrdersFile: this.ordersService['useOrdersFile'],
      sampleOrders: orders.map(o => ({
        _id: o._id,
        orderId: o.orderId,
        status: o.status,
        customerName: o.customerName,
      })),
    };
  }

  @Post('seed')
  async forceSeed() {
    // Forzar seed
    await this.ordersService.seedOrders();
    return { message: 'Seed ejecutado' };
  }
}
