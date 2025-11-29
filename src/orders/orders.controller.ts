import { Controller, Get, Post, Param, Body, Logger } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './interfaces/order.interface';

@Controller('orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);

  constructor(private readonly ordersService: OrdersService) {}

  @Get(':orderId')
  getOrder(@Param('orderId') orderId: string): Order {
    return this.ordersService.getOrderById(orderId);
  }

  @Get()
  getAllOrders(): Order[] {
    return this.ordersService.getAllOrders();
  }

  @Post('webhook')
  receiveWebhook(@Body() body: any): any {
    this.logger.log('=== Webhook Recibido ===');
    this.logger.log('Body completo:', JSON.stringify(body, null, 2));
    
    // Extraer orderId del body
    const orderId = body.orderId;
    
    if (!orderId) {
      this.logger.warn('No se encontró orderId en el request body');
      return {
        success: false,
        message: 'orderId es requerido en el body',
        receivedData: body,
        timestamp: new Date().toISOString()
      };
    }

    this.logger.log(`Buscando orden con ID: ${orderId}`);
    
    try {
      // Buscar la orden en el JSON
      const order = this.ordersService.getOrderById(orderId);
      
      this.logger.log('Orden encontrada:', JSON.stringify(order, null, 2));
      this.logger.log('========================');

      return {
        success: true,
        message: 'Orden encontrada exitosamente',
        receivedData: body,
        order: order,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error(`Error al buscar orden: ${error.message}`);
      this.logger.log('========================');
      
      return {
        success: false,
        message: error.message,
        receivedData: body,
        timestamp: new Date().toISOString()
      };
    }
  }
}
