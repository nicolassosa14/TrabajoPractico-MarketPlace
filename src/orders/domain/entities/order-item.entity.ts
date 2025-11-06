export class OrderItem {
  constructor(
    public id: string,
    public orderId: string,
    public productId: string,
    public quantity: number,
    public price_at_purchase: number,
  ) {}
}
