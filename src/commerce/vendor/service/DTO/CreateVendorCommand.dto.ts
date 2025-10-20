export default class CreateVendorCommand {
  public readonly name: string;
  public readonly email: string;
  public readonly password: string;
  public readonly descripcion: string;
  public readonly address: string;
  public readonly is_active: boolean;

  public constructor(
    name: string,
    email: string,
    password: string,
    descripcion: string,
    address: string,
    is_active?: boolean,
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.descripcion = descripcion;
    this.address = address;
    this.is_active = is_active || true;
  }
}

