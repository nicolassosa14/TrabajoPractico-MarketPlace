import { Injectable } from '@nestjs/common';
import { NotificationService } from '../../application/ports/notification.service';

@Injectable()
export class NotificationAdapter implements NotificationService {
  async sendNotification(userId: string, message: string): Promise<void> {
    console.log(`Notificación para usuario ${userId}: ${message}`);
  }
}
