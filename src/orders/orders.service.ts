import { Injectable, NotFoundException } from '@nestjs/common';
import { Order, OrderStatus } from './interfaces/order.interface';
import * as ordersData from './data/orders.json';

@Injectable()
export class OrdersService {
  private orders: Order[] = ordersData as Order[];

  getOrderById(orderId: string): Order {
    // Buscar la orden por ID
    const order = this.orders.find(o => o.orderId === orderId);
    
    if (!order) {
      throw new NotFoundException(`Orden con ID ${orderId} no encontrada`);
    }

    // Generar un estatus aleatorio
    const randomOrder = this.getOrderWithRandomStatus(order);
    
    return randomOrder;
  }

  private getOrderWithRandomStatus(order: Order): Order {
    const statuses = Object.values(OrderStatus);
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      ...order,
      status: randomStatus
    };
  }

  getAllOrders(): Order[] {
    // Retornar todas las órdenes con estatus aleatorios
    return this.orders.map(order => this.getOrderWithRandomStatus(order));
  }
}
