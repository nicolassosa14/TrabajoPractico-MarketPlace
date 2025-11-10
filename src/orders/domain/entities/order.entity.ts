export class Order {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly vendorId: string,
    public readonly addressId: string,
    public readonly subtotal: number,
    public readonly deliveryFee: number,
    public readonly discountApplied: number,
    public readonly taxes: number,
    public readonly totalAmount: number,
    public status: string,
    public readonly createdAt: Date,
  ) {}
}
