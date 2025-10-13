export default class Admin {
  constructor(
    private readonly email: string,
    private readonly password: string,
    private readonly role: string,
    private readonly id?: string
  ) {}

  public getEmail(): string {
    return this.email;
  }

  public getPassword(): string {
    return this.password;
  }

  public getRole(): string {
    return this.role;
  }

  public getId(): string | undefined {
    return this.id;
  }
}
