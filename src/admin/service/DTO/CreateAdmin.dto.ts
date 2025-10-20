export default class CreateAdminCommand {
  constructor(
    private readonly email: string,
    private readonly password: string,
    private readonly role: string
  ) {}

  getEmail(): string { return this.email; }
  getPassword(): string { return this.password; }
  getRole(): string { return this.role; }
}
