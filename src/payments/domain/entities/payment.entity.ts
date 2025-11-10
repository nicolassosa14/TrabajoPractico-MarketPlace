export type PaymentMethod = 'credit_card' | 'paypal' | 'cash' | 'mercado_pago';
export type PaymentStatus = 'succeeded' | 'failed' | 'pending' | 'cancelled';



export class Payment {
  constructor(
    public id: string,
    public orderId: string,
    public amount: number,
    public tipAmount: number = 0,
    public paymentMethod: PaymentMethod,
    public status: PaymentStatus = 'pending',
    public transactionId?: string,
    public createdAt: Date = new Date()
  ) {}

  markSucceeded(transactionId?: string) {
    this.status = 'succeeded';
    if (transactionId) this.transactionId = transactionId;
  }

  markFailed() {
    this.status = 'failed';
  }

  total(): number {
    return this.amount + (this.tipAmount || 0);
  }

  toPersistence() {
    return {
      id: this.id,
      order_id: this.orderId,
      amount: this.amount,
      tip_amount: this.tipAmount,
      payment_method: this.paymentMethod,
      status: this.status,
      transaction_id: this.transactionId,
      created_at: this.createdAt.toISOString(),
    };
  }
}