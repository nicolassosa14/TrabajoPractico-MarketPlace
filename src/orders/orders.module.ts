import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module'; // Import SupabaseModule
import { OrdersController } from './interfaces/orders.controller';
import { CreateOrderService } from './application/use-cases/create-order.service';
import { UpdateStatusService } from './application/use-cases/update-status.service';
import { GetOrdersService } from './application/use-cases/get-orders.service';
import { SupabaseOrderRepository } from './insfrastructure/repositories/supabase-order.repository';
import { PaymentAdapter } from './insfrastructure/repositories/adapters/payment.adapter';
import { NotificationAdapter } from './insfrastructure/repositories/adapters/notification.adapter';
import { OrderRepository } from './application/ports/order.repository';
import { PaymentService } from './application/ports/payment.service';
import { NotificationService } from './application/ports/notification.service';

@Module({
    imports: [SupabaseModule], // Add SupabaseModule to imports
    controllers: [OrdersController],
    providers: [
        CreateOrderService,
        UpdateStatusService,
        GetOrdersService,
        { provide: OrderRepository, useClass: SupabaseOrderRepository },
        { provide: PaymentService, useClass: PaymentAdapter },
        { provide: NotificationService, useClass: NotificationAdapter },
    ],
})
export class OrdersModule {}