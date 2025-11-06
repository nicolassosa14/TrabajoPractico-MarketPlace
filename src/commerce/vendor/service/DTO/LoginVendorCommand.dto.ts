export default class LoginVendorCommand {
  getEmail(): string {
    return this.email;
  }
  getPassword(): string {
    return this.password;
  }
  private readonly email: string;
  private readonly password: string;
  public constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
