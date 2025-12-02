import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class TwilioMessagingService {
  private readonly logger = new Logger(TwilioMessagingService.name);
  private twilioClient: Twilio;

  constructor(private readonly configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');

    if (accountSid && authToken) {
      this.twilioClient = new Twilio(accountSid, authToken);
      this.logger.log('Cliente de Twilio inicializado correctamente');
    } else {
      this.logger.warn('Credenciales de Twilio no configuradas');
    }
  }

  async sendMessage(to: string, message: string): Promise<any> {
    try {
      const from = this.configService.get<string>('TWILIO_PHONE_NUMBER');

      if (!from) {
        throw new Error('TWILIO_PHONE_NUMBER no configurado');
      }

      this.logger.log(`Enviando mensaje a ${to}`);
      
      const result = await this.twilioClient.messages.create({
        body: message,
        from: from,
        to: to,
      });

      this.logger.log(`Mensaje enviado exitosamente. SID: ${result.sid}`);
      
      return result;
    } catch (error) {
      this.logger.error(`Error al enviar mensaje: ${error.message}`, error.stack);
      throw error;
    }
  }

  async sendWhatsAppMessage(to: string, message: string): Promise<any> {
    try {
      const from = this.configService.get<string>('TWILIO_WHATSAPP_NUMBER');

      if (!from) {
        throw new Error('TWILIO_WHATSAPP_NUMBER no configurado');
      }

      // Asegurar formato de WhatsApp
      const whatsappTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
      const whatsappFrom = from.startsWith('whatsapp:') ? from : `whatsapp:${from}`;

      this.logger.log(`Enviando mensaje de WhatsApp a ${whatsappTo}`);
      
      const result = await this.twilioClient.messages.create({
        body: message,
        from: whatsappFrom,
        to: whatsappTo,
      });

      this.logger.log(`Mensaje de WhatsApp enviado. SID: ${result.sid}`);
      
      return result;
    } catch (error) {
      this.logger.error(`Error al enviar WhatsApp: ${error.message}`, error.stack);
      throw error;
    }
  }

  async sendMediaMessage(to: string, message: string, mediaUrls: string[]): Promise<any> {
    try {
      const from = this.configService.get<string>('TWILIO_WHATSAPP_NUMBER');

      if (!from) {
        throw new Error('TWILIO_WHATSAPP_NUMBER no configurado');
      }

      const whatsappTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
      const whatsappFrom = from.startsWith('whatsapp:') ? from : `whatsapp:${from}`;

      this.logger.log(`Enviando mensaje con ${mediaUrls.length} archivo(s) multimedia`);
      
      const result = await this.twilioClient.messages.create({
        body: message,
        from: whatsappFrom,
        to: whatsappTo,
        mediaUrl: mediaUrls,
      });

      this.logger.log(`Mensaje con multimedia enviado. SID: ${result.sid}`);
      
      return result;
    } catch (error) {
      this.logger.error(`Error al enviar multimedia: ${error.message}`, error.stack);
      throw error;
    }
  }
}
