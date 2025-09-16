export default class CreateUserCommand {
  getPhone(): number {
    throw new Error('Method not implemented.');
  }
  getEmail(): string {
    throw new Error('Method not implemented.');
  }
  getName(): string {
    throw new Error('Method not implemented.');
  }
  private readonly name: string;
  private readonly email: string;
  private readonly phone: number;
  public constructor(name: string, email: string, phone: number) {
    this.name = name;
    this.email = email;
    this.phone = phone;
  }
}
