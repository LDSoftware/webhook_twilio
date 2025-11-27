import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS si lo necesitas
  app.enableCors();
  
  await app.listen(3000);
  console.log('🚀 Aplicación corriendo en http://localhost:3000');
  console.log('📦 Endpoints disponibles:');
  console.log('   GET /orders - Obtener todas las órdenes');
  console.log('   GET /orders/:orderId - Obtener orden específica');
}

bootstrap();
