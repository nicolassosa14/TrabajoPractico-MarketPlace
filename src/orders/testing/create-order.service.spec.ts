import { Test, TestingModule } from '@nestjs/testing';
import { CreateOrderService } from '../application/use-cases/create-order.service';
import { OrderRepository } from '../application/ports/order.repository';
import { PaymentService } from '../application/ports/payment.service';
import { NotificationService } from '../application/ports/notification.service';
import { Order } from '../domain/entities/order.entity';

describe('CreateOrderService', () => {
    let service: CreateOrderService;
    let mockOrderRepository: jest.Mocked<OrderRepository>;
    let mockPaymentService: jest.Mocked<PaymentService>;
    let mockNotificationService: jest.Mocked<NotificationService>;

    beforeEach(async () => {
        mockOrderRepository = {
        create: jest.fn(),
        findAll: jest.fn(),
        updateStatus: jest.fn(),
        } as unknown as jest.Mocked<OrderRepository>;

        mockPaymentService = {
        processPayment: jest.fn(),
        } as unknown as jest.Mocked<PaymentService>;

        mockNotificationService = {
        sendNotification: jest.fn(),
        } as unknown as jest.Mocked<NotificationService>;

        const module: TestingModule = await Test.createTestingModule({
        providers: [
            CreateOrderService,
            { provide: 'OrderRepository', useValue: mockOrderRepository },
            { provide: 'PaymentService', useValue: mockPaymentService },
            { provide: 'NotificationService', useValue: mockNotificationService },
        ],
        }).compile();

        service = module.get<CreateOrderService>(CreateOrderService);
    });

    it('debería crear una orden correctamente', async () => {
        const fakeOrder = new Order(
        '1',
        'user1',
        'vendor1',
        'address1',
        100,
        10,
        0,
        15,
        125,
        'pending',
        new Date(),
        );

        mockOrderRepository.create.mockResolvedValue(fakeOrder);

        const result = await service.execute(fakeOrder);

        expect(result).toEqual(fakeOrder);
        expect(mockOrderRepository.create).toHaveBeenCalledTimes(1);
        expect(mockPaymentService.processPayment).toHaveBeenCalled();
        expect(mockNotificationService.sendNotification).toHaveBeenCalled();
    });
});
