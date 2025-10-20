export default class DeleteAdminCommand {
  constructor(private readonly id: string) {
    if (!id) throw new Error('Debes proporcionar un id');
  }

  getId(): string { return this.id; }
}
