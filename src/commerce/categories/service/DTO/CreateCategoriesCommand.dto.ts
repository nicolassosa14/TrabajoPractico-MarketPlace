export default class CreateCategoriesCommand {
    public readonly name: string;
    public readonly description: string;

    public constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    }
}

