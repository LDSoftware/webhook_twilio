import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS si lo necesitas
  app.enableCors();
  
  // Puerto dinámico para Azure App Service
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Aplicación corriendo en puerto ${port}`);
  console.log('📦 Endpoints disponibles:');
  console.log('   GET /orders - Obtener todas las órdenes');
  console.log('   GET /orders/:orderId - Obtener orden específica');
}

bootstrap();
