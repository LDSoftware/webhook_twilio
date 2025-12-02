import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TwilioMediaService {
  private readonly logger = new Logger(TwilioMediaService.name);
  private readonly uploadsDir = path.join(process.cwd(), 'uploads');

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    // Crear directorio de uploads si no existe
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
      this.logger.log(`Directorio de uploads creado: ${this.uploadsDir}`);
    }
  }

  async downloadMedia(mediaUrl: string, messageSid: string): Promise<string> {
    try {
      const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
      const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');

      if (!accountSid || !authToken) {
        throw new Error('Credenciales de Twilio no configuradas');
      }

      // Crear autenticación básica
      const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

      this.logger.log(`Descargando imagen desde: ${mediaUrl}`);

      // Descargar la imagen
      const response = await firstValueFrom(
        this.httpService.get(mediaUrl, {
          headers: {
            Authorization: `Basic ${auth}`,
          },
          responseType: 'arraybuffer',
        }),
      );

      // Obtener el tipo de contenido
      const contentType = response.headers['content-type'];
      const extension = this.getFileExtension(contentType);

      // Crear nombre de archivo único
      const timestamp = Date.now();
      const fileName = `${messageSid}_${timestamp}${extension}`;
      const filePath = path.join(this.uploadsDir, fileName);

      // Guardar archivo
      fs.writeFileSync(filePath, response.data);

      this.logger.log(`Imagen guardada en: ${filePath}`);

      return filePath;
    } catch (error) {
      this.logger.error(`Error al descargar imagen: ${error.message}`, error.stack);
      throw error;
    }
  }

  async downloadMultipleMedia(body: any): Promise<string[]> {
    const numMedia = parseInt(body.NumMedia || '0');
    const downloadedFiles: string[] = [];

    if (numMedia === 0) {
      return downloadedFiles;
    }

    this.logger.log(`Procesando ${numMedia} archivo(s) multimedia`);

    for (let i = 0; i < numMedia; i++) {
      const mediaUrl = body[`MediaUrl${i}`];
      const mediaType = body[`MediaContentType${i}`];

      this.logger.log(`Media ${i}: ${mediaType}`);

      if (mediaUrl) {
        try {
          const filePath = await this.downloadMedia(mediaUrl, body.MessageSid);
          downloadedFiles.push(filePath);
        } catch (error) {
          this.logger.error(`Error al descargar media ${i}: ${error.message}`);
        }
      }
    }

    return downloadedFiles;
  }

  private getFileExtension(contentType: string): string {
    const mimeTypes: { [key: string]: string } = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
      'video/mp4': '.mp4',
      'audio/mpeg': '.mp3',
      'audio/ogg': '.ogg',
      'application/pdf': '.pdf',
    };

    return mimeTypes[contentType] || '.bin';
  }

  getMediaInfo(body: any): any {
    const numMedia = parseInt(body.NumMedia || '0');
    
    if (numMedia === 0) {
      return null;
    }

    const mediaList = [];
    for (let i = 0; i < numMedia; i++) {
      mediaList.push({
        url: body[`MediaUrl${i}`],
        contentType: body[`MediaContentType${i}`],
      });
    }

    return {
      count: numMedia,
      media: mediaList,
    };
  }
}
