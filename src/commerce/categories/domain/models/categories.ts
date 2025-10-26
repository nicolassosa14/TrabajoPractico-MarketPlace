export default class categories {
    public constructor(
        private readonly name: string,
        private readonly description : string,
        private readonly id?: number,

    ){
        
    }
        
    public getId() : number | undefined{
        return this.id
    }

    public getName() : string{
        return this.name
    }

    public getDescription() : string {
        return this.description
    }
}