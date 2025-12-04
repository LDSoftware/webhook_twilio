import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order as OrderInterface, OrderStatus } from './interfaces/order.interface';
import { Order, OrderDocument } from './schemas/order.schema';
import ordersData from './data/orders.json';

@Injectable()
export class OrdersService {
  private orders: OrderInterface[] = ordersData as OrderInterface[];
  private useOrdersFile: boolean;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {
    this.useOrdersFile = this.configService.get<boolean>('mongodb.useOrdersFile', true);
    console.log(`[OrdersService] Usando archivo JSON: ${this.useOrdersFile}`);
  }

  async getOrderById(orderId: string): Promise<OrderInterface> {
    if (this.useOrdersFile) {
      // Buscar en el archivo JSON
      const order = this.orders.find(o => o.orderId === orderId);
      
      if (!order) {
        throw new NotFoundException(`Orden con ID ${orderId} no encontrada`);
      }

      // Generar un estatus aleatorio
      return this.getOrderWithRandomStatus(order);
    } else {
      // Buscar en MongoDB
      const order = await this.orderModel.findOne({ orderId }).lean().exec();
      
      if (!order) {
        throw new NotFoundException(`Orden con ID ${orderId} no encontrada`);
      }

      // Convertir a interface y generar estatus aleatorio
      const orderInterface = this.mongoToInterface(order);
      return this.getOrderWithRandomStatus(orderInterface);
    }
  }

  private getOrderWithRandomStatus(order: OrderInterface): OrderInterface {
    const statuses = Object.values(OrderStatus);
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      ...order,
      status: randomStatus
    };
  }

  private mongoToInterface(mongoOrder: any): OrderInterface {
    return {
      orderId: mongoOrder.orderId,
      status: mongoOrder.status,
      customerName: mongoOrder.customerName,
      customerEmail: mongoOrder.customerEmail,
      orderDate: mongoOrder.orderDate,
      totalAmount: mongoOrder.totalAmount,
      items: mongoOrder.items,
      shippingAddress: mongoOrder.shippingAddress,
    };
  }

  async getAllOrders(): Promise<OrderInterface[]> {
    if (this.useOrdersFile) {
      // Retornar todas las órdenes del JSON con estatus aleatorios
      return this.orders.map(order => this.getOrderWithRandomStatus(order));
    } else {
      // Consultar MongoDB
      const orders = await this.orderModel.find().lean().exec();
      
      // Convertir y agregar estatus aleatorios
      return orders.map(order => {
        const orderInterface = this.mongoToInterface(order);
        return this.getOrderWithRandomStatus(orderInterface);
      });
    }
  }

  async createOrder(orderData: Partial<OrderInterface>): Promise<OrderInterface> {
    if (this.useOrdersFile) {
      throw new Error('No se pueden crear órdenes cuando se usa el archivo JSON');
    }

    const newOrder = new this.orderModel(orderData);
    const savedOrder = await newOrder.save();
    return this.mongoToInterface(savedOrder.toObject());
  }

  async seedOrders(): Promise<void> {
    if (this.useOrdersFile) {
      console.log('[OrdersService] No se puede hacer seed con USE_ORDERS_FILE=true');
      return;
    }

    // Verificar si ya hay datos
    const count = await this.orderModel.countDocuments();
    if (count > 0) {
      console.log(`[OrdersService] Ya existen ${count} órdenes en MongoDB`);
      return;
    }

    // Insertar datos del JSON
    console.log('[OrdersService] Insertando datos iniciales en MongoDB...');
    await this.orderModel.insertMany(this.orders);
    console.log(`[OrdersService] ${this.orders.length} órdenes insertadas exitosamente`);
  }
}
