export type PaymentMethod = 'cash' | 'mercado_pago';
export type PaymentStatus = 'pending' | 'approved' | 'failed' | 'cancelled' | 'refunded';

export class Payment {
  constructor(
    public id: string,
    public orderId: string,
    public amount: number,
    public currency: string = 'ARS',
    public method: PaymentMethod = 'mercado_pago',
    public status: PaymentStatus = 'pending',
    public externalId?: string, // para guardar el id que te da mp u otro proveedor
    public metadata?: Record<string, any>,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  markApproved(externalId?: string) {
    this.status = 'approved';
    if (externalId) this.externalId = externalId;
    this.updatedAt = new Date();
  }

  markFailed() {
    this.status = 'failed';
    this.updatedAt = new Date();
  }

  toPlainObject() {
    return {
      id: this.id,
      orderId: this.orderId,
      amount: this.amount,
      currency: this.currency,
      method: this.method,
      status: this.status,
      externalId: this.externalId,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
