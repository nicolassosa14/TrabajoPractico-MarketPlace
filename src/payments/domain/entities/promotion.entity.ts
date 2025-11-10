export type DiscountType = 'percentage' | 'fixed_amount';

export class Promotion {
  constructor(
    public id: number,
    public code: string,
    public description: string | null,
    public discountType: DiscountType,
    public discountValue: number,
    public expiresAt: Date | null,
    public isActive: boolean
  ) {}

  isValid(): boolean {
    if (!this.isActive) return false;
    if (this.expiresAt && new Date() > this.expiresAt) return false;
    return true;
  }

  apply(total: number): number {
    if (this.discountType === 'percentage') {
      return Math.max(0, total - (total * (this.discountValue / 100)));
    } else {
      return Math.max(0, total - this.discountValue);
    }
  }
}
