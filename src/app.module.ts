import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersModule } from './orders/orders.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: [
        '.env.development.local',
        '.env.development',
        '.env.production.local', 
        '.env.production',
        '.env',
      ],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const useOrdersFile = configService.get<boolean>('mongodb.useOrdersFile', true);
        const uri = configService.get<string>('mongodb.uri');
        
        // Solo conectar a MongoDB si no se usa el archivo JSON
        if (!useOrdersFile && uri) {
          console.log('[MongoDB] Conectando a MongoDB...');
          return { uri };
        } else {
          console.log('[MongoDB] Usando archivo JSON, sin conexión a MongoDB');
          // Retornar configuración vacía para no conectar
          return { uri: 'mongodb://localhost:27017/dummy' };
        }
      },
      inject: [ConfigService],
    }),
    OrdersModule,
  ],
})
export class AppModule {}
