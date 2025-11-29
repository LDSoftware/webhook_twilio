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
let OrdersController = OrdersController_1 = class OrdersController {
    constructor(ordersService) {
        this.ordersService = ordersService;
        this.logger = new common_1.Logger(OrdersController_1.name);
    }
    getOrder(orderId) {
        return this.ordersService.getOrderById(orderId);
    }
    getAllOrders() {
        return this.ordersService.getAllOrders();
    }
    receiveWebhook(body) {
        this.logger.log('=== Webhook Recibido ===');
        this.logger.log('Body completo:', JSON.stringify(body, null, 2));
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
        }
        catch (error) {
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
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Get)(':orderId'),
    __param(0, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], OrdersController.prototype, "getOrder", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], OrdersController.prototype, "getAllOrders", null);
__decorate([
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], OrdersController.prototype, "receiveWebhook", null);
exports.OrdersController = OrdersController = OrdersController_1 = __decorate([
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map