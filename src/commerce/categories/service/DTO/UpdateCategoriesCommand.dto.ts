export default class UpdateCategoryCommand{
    private readonly id: number;
    private readonly name?: string
    private readonly description?: string;

    public constructor(id: number, name?: string, description?: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
    public getId(): number{
        return this.id;
    }
    public getName(): string | undefined{
        return this.name;
    }
    public getDescription(): string | undefined{
        return this.description;
    }
}