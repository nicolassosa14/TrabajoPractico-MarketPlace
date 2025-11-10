export default class CreateCategoriesCommand {
    public readonly name: string;
    public readonly description: string;
    public readonly image_url: string;
    public readonly user_id: string;
    

    public constructor(name: string, description: string, image_url: string,user_id: string,) {
        this.name = name;
        this.description = description;
        this.image_url = image_url;
        this.user_id = user_id;
    }
}

