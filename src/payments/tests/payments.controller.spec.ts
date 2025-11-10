import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from '../presentation/controllers/payments.controller';
import type { PaymentRepository } from '../domain/repositories/payment.repository';
import { Payment } from '../domain/entities/payment.entity';
import { v4 as uuidv4 } from 'uuid';

describe('PaymentsController', () => {
    let controller: PaymentsController;
    let mockPaymentRepo: jest.Mocked<PaymentRepository>;

    beforeEach(async () => {
        mockPaymentRepo = {
        create: jest.fn(),
        findById: jest.fn(),
        findByOrder: jest.fn(),
        findByTransactionId: jest.fn(),
        update: jest.fn(),
        } as any;

        const module: TestingModule = await Test.createTestingModule({
        controllers: [PaymentsController],
        providers: [{ provide: 'PaymentRepository', useValue: mockPaymentRepo }],
        }).compile();

        controller = module.get<PaymentsController>(PaymentsController);
    });

    it('deberia crear un pago correctamente y devolver su estado', async () => {
        const dto = {
        orderId: uuidv4(),
        amount: 1000,
        tipAmount: 100,
        paymentMethod: 'mercado_pago' as const,
        };

        const mockPayment = new Payment(
        uuidv4(),
        dto.orderId,
        dto.amount,
        dto.tipAmount,
        dto.paymentMethod,
        'pending',
        'TX-12345'
        );

        mockPaymentRepo.create.mockResolvedValue(mockPayment);

        const result = await controller.create(dto);

        expect(result.status).toBe('pending');
        expect(mockPaymentRepo.create).toHaveBeenCalledTimes(1);
    });
    });
