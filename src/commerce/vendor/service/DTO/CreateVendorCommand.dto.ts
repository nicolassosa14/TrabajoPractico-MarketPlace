export default class CreateVendorCommand {
  public readonly name: string;
  public readonly description: string;
  public readonly address: string;
  public readonly is_active: boolean;
  public readonly user_id: string;

  public constructor(
    name: string,
    description: string,
    address: string,
    user_id: string,
    is_active?: boolean,
  ) {
    this.name = name;
    this.description = description;
    this.address = address;
    this.user_id = user_id;
    this.is_active = is_active || true;
  }
}
