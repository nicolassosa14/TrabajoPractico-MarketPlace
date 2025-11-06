export default class CreateCategoriesCommand {
  public readonly name: string;
  public readonly description: string;
  public readonly user_id: string;

  public constructor(name: string, description: string, user_id: string) {
    this.name = name;
    this.description = description;
    this.user_id = user_id;
  }
}
