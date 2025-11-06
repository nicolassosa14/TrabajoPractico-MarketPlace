export default class Vendor {
  public constructor(
    private readonly description: string,
    private readonly address: string,
    private readonly is_active: boolean = true,
    private readonly user_id: string,
    private readonly name?: string,
    private readonly id?: number,
  ) {}

  public getDescription(): string {
    return this.description;
  }

  public getAddress(): string {
    return this.address;
  }

  public getisActive(): boolean {
    return this.is_active;
  }

  public getName(): string | undefined {
    return this.name;
  }

  public getId(): number | undefined {
    return this.id;
  }
  public getUserId(): string {
    return this.user_id;
  }
}
