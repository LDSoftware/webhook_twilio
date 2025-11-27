"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    await app.listen(3000);
    console.log('🚀 Aplicación corriendo en http://localhost:3000');
    console.log('📦 Endpoints disponibles:');
    console.log('   GET /orders - Obtener todas las órdenes');
    console.log('   GET /orders/:orderId - Obtener orden específica');
}
bootstrap();
//# sourceMappingURL=main.js.map