import { Controller, Get, Post, Param, Body, Logger } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { TwilioMediaService } from './twilio-media.service';
import { TwilioMessagingService } from './twilio-messaging.service';
import { Order } from './interfaces/order.interface';

@Controller('orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);

  constructor(
    private readonly ordersService: OrdersService,
    private readonly twilioMediaService: TwilioMediaService,
    private readonly twilioMessagingService: TwilioMessagingService,
  ) {}

  @Get(':orderId')
  getOrder(@Param('orderId') orderId: string): Order {
    return this.ordersService.getOrderById(orderId);
  }

  @Get()
  getAllOrders(): Order[] {
    return this.ordersService.getAllOrders();
  }

  @Post('webhook')
  async receiveWebhook(@Body() body: any): Promise<void> {
    this.logger.log('=== Webhook de Twilio Recibido ===');
    this.logger.log('From:', body.From);
    this.logger.log('To:', body.To);
    this.logger.log('Body:', body.Body);
    this.logger.log('MessageSid:', body.MessageSid);
    
    const fromNumber = body.From;
    
    // Verificar si hay imágenes/multimedia
    const mediaInfo = this.twilioMediaService.getMediaInfo(body);
    
    if (mediaInfo) {
      this.logger.log(`Se detectaron ${mediaInfo.count} archivo(s) multimedia`);
      
      try {
        // Descargar todas las imágenes
        const downloadedFiles = await this.twilioMediaService.downloadMultipleMedia(body);
        
        this.logger.log(`Imágenes descargadas: ${downloadedFiles.length}`);
        downloadedFiles.forEach((file, index) => {
          this.logger.log(`  [${index + 1}] ${file}`);
        });

        // Responder al usuario
        const responseMessage = `✅ He recibido ${mediaInfo.count} imagen(es).\n\n` +
          `Total de archivos procesados: ${downloadedFiles.length}\n` +
          `Mensaje: ${body.Body || 'Sin texto'}`;
        
        await this.twilioMessagingService.sendWhatsAppMessage(fromNumber, responseMessage);
        
        this.logger.log('Respuesta enviada exitosamente');
        this.logger.log('========================');
      } catch (error) {
        this.logger.error(`Error al descargar imágenes: ${error.message}`);
        
        // Enviar mensaje de error al usuario
        await this.twilioMessagingService.sendWhatsAppMessage(
          fromNumber,
          '❌ Hubo un error al procesar tus imágenes. Por favor intenta de nuevo.'
        );
      }
      return;
    }
    
    // Si no hay imágenes, procesar como consulta de orden
    const orderId = body.Body?.trim();
    
    if (!orderId) {
      this.logger.warn('No se encontró orderId ni imágenes en el mensaje');
      
      await this.twilioMessagingService.sendWhatsAppMessage(
        fromNumber,
        '📦 Para consultar tu orden, envía el número de orden.\n\nEjemplo: ORD-2024-001'
      );
      return;
    }

    this.logger.log(`Buscando orden con ID: ${orderId}`);
    
    try {
      // Buscar la orden en el JSON
      const order = this.ordersService.getOrderById(orderId);
      
      this.logger.log('Orden encontrada:', JSON.stringify(order, null, 2));
      
      // Formatear respuesta para el usuario
      const itemsList = order.items
        .map((item, idx) => `${idx + 1}. ${item.productName} x${item.quantity} - $${item.subtotal}`)
        .join('\n');
      
      const responseMessage = 
        `📦 *Información de tu Orden*\n\n` +
        `*Orden:* ${order.orderId}\n` +
        `*Estado:* ${order.status}\n` +
        `*Cliente:* ${order.customerName}\n` +
        `*Email:* ${order.customerEmail}\n` +
        `*Fecha:* ${new Date(order.orderDate).toLocaleDateString('es-MX')}\n\n` +
        `*Productos:*\n${itemsList}\n\n` +
        `*Total:* $${order.totalAmount}\n` +
        `*Dirección de envío:* ${order.shippingAddress}`;

      await this.twilioMessagingService.sendWhatsAppMessage(fromNumber, responseMessage);
      
      this.logger.log('Respuesta enviada exitosamente');
      this.logger.log('========================');
    } catch (error) {
      this.logger.error(`Error al buscar orden: ${error.message}`);
      this.logger.log('========================');
      
      // Enviar mensaje de orden no encontrada
      await this.twilioMessagingService.sendWhatsAppMessage(
        fromNumber,
        `❌ No se encontró la orden "${orderId}".\n\nVerifica el número de orden e intenta nuevamente.\n\nÓrdenes disponibles:\n- ORD-2024-001\n- ORD-2024-002\n- ORD-2024-003\n- ORD-2024-004\n- ORD-2024-005`
      );
    }
  }
}
