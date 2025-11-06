export default class DeleteAddressCommand {
  private readonly user_id: string;
  private readonly id: string;

  public constructor(user_id: string, id: string) {
    this.user_id = user_id;
    this.id = id;
  }

  getUser_id(): string {
    return this.user_id;
  }
  getId(): string {
    return this.id;
  }
}
