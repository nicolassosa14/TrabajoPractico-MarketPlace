export class Commission {
  constructor(
    public id: string,
    public orderId: string,
    public platformFee: number,
    public vendorEarning: number,
    public driverEarning: number
  ) {}

  static calculateFromPayment(paymentAmount: number, tipAmount: number, platformRate: number) {
    const platformFee = Number((paymentAmount * platformRate).toFixed(2));
    const vendorEarning = Number((paymentAmount - platformFee).toFixed(2));
    const driverEarning = Number(tipAmount || 0);
    return new Commission(
      crypto.randomUUID(),
      '', // set orderId later
      platformFee,
      vendorEarning,
      driverEarning
    );
  }
}
