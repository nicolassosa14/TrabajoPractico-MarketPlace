

export default class UpdateAdminCommand {
  constructor(
    private readonly id: string,
    private readonly email?: string,
    private readonly role?: string
  ) {}

  getId(): string { return this.id; }
  getEmail(): string | undefined { return this.email; }
  getRole(): string | undefined { return this.role; }
}