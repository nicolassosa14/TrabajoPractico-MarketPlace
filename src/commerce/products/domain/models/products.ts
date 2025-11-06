export default class Product {
  constructor(
    private readonly name: string,
    private readonly description: string,
    private readonly image_url: string,
    private readonly price: number,
    private readonly is_available: boolean = true,
    private readonly vendor_id?: string,
    private readonly id?: number,
  ) {}

  public getId(): number | undefined {
    return this.id;
  }

  public getVendorId(): string | undefined {
    return this.vendor_id;
  }

  public getName(): string {
    return this.name;
  }

  public getDescription(): string {
    return this.description;
  }

  public getPrice(): number {
    return this.price;
  }

  public getImageUrl(): string {
    return this.image_url;
  }

  public getIsAvailable(): boolean {
    return this.is_available;
  }
}
