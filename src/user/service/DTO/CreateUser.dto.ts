export default class CreateUserCommand {
  getEmail(): string {
    return this.email;
  }
  getPassword() : string{
    return this.password;
  }
  getFirst_Name() : string{
    return this.first_name;
  }
  getLast_Name() : string{
    return this.last_name;
  }
  private readonly email: string;
  private readonly password: string;
  private readonly first_name: string;
  private readonly last_name: string;
  public constructor(email: string, password: string, first_name:string,last_name:string) {
    this.email = email;
    this.password = password;
    this.first_name = first_name
    this.last_name = last_name
  }
}