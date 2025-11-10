export abstract class PaymentService {
  abstract processPayment(orderId: string, amount: number): Promise<void>;
}
