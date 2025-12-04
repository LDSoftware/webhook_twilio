"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var OrdersController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const twilio_media_service_1 = require("./twilio-media.service");
const twilio_messaging_service_1 = require("./twilio-messaging.service");
let OrdersController = OrdersController_1 = class OrdersController {
    constructor(ordersService, twilioMediaService, twilioMessagingService) {
        this.ordersService = ordersService;
        this.twilioMediaService = twilioMediaService;
        this.twilioMessagingService = twilioMessagingService;
        this.logger = new common_1.Logger(OrdersController_1.name);
    }
    async getOrder(orderId) {
        return await this.ordersService.getOrderById(orderId);
    }
    async getAllOrders() {
        return await this.ordersService.getAllOrders();
    }
    async receiveWebhook(body) {
        this.logger.log('=== Webhook de Twilio Recibido ===');
        this.logger.log('From:', body.From);
        this.logger.log('To:', body.To);
        this.logger.log('Body:', body.Body);
        this.logger.log('MessageSid:', body.MessageSid);
        const fromNumber = body.From;
        const mediaInfo = this.twilioMediaService.getMediaInfo(body);
        if (mediaInfo) {
            this.logger.log(`Se detectaron ${mediaInfo.count} archivo(s) multimedia`);
            try {
                const downloadedFiles = await this.twilioMediaService.downloadMultipleMedia(body);
                this.logger.log(`Imágenes descargadas: ${downloadedFiles.length}`);
                downloadedFiles.forEach((file, index) => {
                    this.logger.log(`  [${index + 1}] ${file}`);
                });
                const responseMessage = `✅ He recibido ${mediaInfo.count} imagen(es).\n\n` +
                    `Total de archivos procesados: ${downloadedFiles.length}\n` +
                    `Mensaje: ${body.Body || 'Sin texto'}`;
                await this.twilioMessagingService.sendWhatsAppMessage(fromNumber, responseMessage);
                this.logger.log('Respuesta enviada exitosamente');
                this.logger.log('========================');
            }
            catch (error) {
                this.logger.error(`Error al descargar imágenes: ${error.message}`);
                await this.twilioMessagingService.sendWhatsAppMessage(fromNumber, '❌ Hubo un error al procesar tus imágenes. Por favor intenta de nuevo.');
            }
            return;
        }
        const orderId = body.Body?.trim();
        if (!orderId) {
            this.logger.warn('No se encontró orderId ni imágenes en el mensaje');
            await this.twilioMessagingService.sendWhatsAppMessage(fromNumber, '📦 Para consultar tu orden, envía el número de orden.\n\nEjemplo: ORD-2024-001');
            return;
        }
        this.logger.log(`Buscando orden con ID: ${orderId}`);
        try {
            const order = await this.ordersService.getOrderById(orderId);
            this.logger.log('Orden encontrada:', JSON.stringify(order, null, 2));
            const itemsList = order.items
                .map((item, idx) => `${idx + 1}. ${item.productName} x${item.quantity} - $${item.subtotal}`)
                .join('\n');
            const responseMessage = `📦 *Información de tu Orden*\n\n` +
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
        }
        catch (error) {
            this.logger.error(`Error al buscar orden: ${error.message}`);
            this.logger.log('========================');
            await this.twilioMessagingService.sendWhatsAppMessage(fromNumber, `❌ No se encontró la orden "${orderId}".\n\nVerifica el número de orden e intenta nuevamente.\n\nÓrdenes disponibles:\n- ORD-2024-001\n- ORD-2024-002\n- ORD-2024-003\n- ORD-2024-004\n- ORD-2024-005`);
        }
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Get)(':orderId'),
    __param(0, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getOrder", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getAllOrders", null);
__decorate([
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "receiveWebhook", null);
exports.OrdersController = OrdersController = OrdersController_1 = __decorate([
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService,
        twilio_media_service_1.TwilioMediaService,
        twilio_messaging_service_1.TwilioMessagingService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map