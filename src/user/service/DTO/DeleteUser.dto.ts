export default class DeleteUserCommand {
       public getId(): number | undefined {
        return this.id;
    }
    public getUuid(): string | undefined {
        return this.uuid;
    }
    private readonly id?: number;
    private readonly uuid?: string;    
    public constructor(id?: number, uuid?: string) {
        if(!id && !uuid){
            throw new Error('You must provide either an id or a uuid to delete a user.');
        }
        this.id = id;
        this.uuid = uuid;
    }
 

}