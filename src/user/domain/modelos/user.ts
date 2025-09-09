export default class User{
    public constructor (
        private readonly name: string,
        private readonly email: string,
        private readonly phone: number,
        private readonly id?: number,
        private readonly uuid?: string,
    )
    {
    }

    public getName() : string
    {
        return this.name;
    }
}