export default class CreateVendorCommand {
  public readonly name: string;
  public readonly description: string;
  public readonly address: string;
  public readonly is_active: boolean;
  public readonly user_id: string;
  public readonly image_url?: string;


  public constructor(
    name: string,
    description: string,
    address: string,
    is_active: boolean,
    user_id: string,
    image_url?: string,
  ) {
    this.name = name;
    this.description = description;
    this.address = address;
    this.user_id = user_id;
    this.is_active = is_active || true;
    this.image_url = image_url;
  }
}
