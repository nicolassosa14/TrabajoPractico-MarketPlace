import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from '../payments.service';
import type { PaymentRepository } from '../domain/repositories/payment.repository';
import { Payment } from '../domain/entities/payment.entity';
import { v4 as uuidv4 } from 'uuid';

describe('PaymentsService', () => {
  let service: PaymentsService;
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
      providers: [
        PaymentsService,
        { provide: 'PaymentRepository', useValue: mockPaymentRepo },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('debería crear un pago y guardarlo correctamente', async () => {
    const payment = new Payment(
      uuidv4(),
      uuidv4(),
      2000,
      200,
      'mercado_pago',
      'pending',
      'TX-999'
    );

    mockPaymentRepo.create.mockResolvedValue(payment);

    const result = await service.createPayment({
      orderId: payment.orderId,
      amount: payment.amount,
      tipAmount: payment.tipAmount,
      paymentMethod: payment.paymentMethod,
    });

    expect(result.status).toBe('pending'); 
    expect(mockPaymentRepo.create).toHaveBeenCalledWith(expect.any(Payment));
  });
});
