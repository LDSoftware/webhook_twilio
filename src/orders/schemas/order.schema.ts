import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema()
export class OrderItem {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  unitPrice: number;

  @Prop({ required: true })
  subtotal: number;
}

@Schema({ collection: 'orders', timestamps: true })
export class Order {
  @Prop({ required: true, unique: true, index: true })
  orderId: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true })
  customerEmail: string;

  @Prop({ required: true })
  orderDate: string;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ type: [OrderItem], required: true })
  items: OrderItem[];

  @Prop({ required: true })
  shippingAddress: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
