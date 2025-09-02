import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {


    private constructor(
        @Inject(USER_REPOSITORY )
    )
    private users = [
            {id: 1, name:"pedro"},
            {id: 2, name:"pablo"}
        ]
    
    GetAllUsers(){
        return this.users
    }


}