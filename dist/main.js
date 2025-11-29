"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`🚀 Aplicación corriendo en puerto ${port}`);
    console.log('📦 Endpoints disponibles:');
    console.log('   GET /orders - Obtener todas las órdenes');
    console.log('   GET /orders/:orderId - Obtener orden específica');
}
bootstrap();
//# sourceMappingURL=main.js.map