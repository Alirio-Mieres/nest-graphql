import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { SignupInput } from './dto/inputs/singup.input';
import { AuthResponse } from './dto/types/auth-response.types';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UsersService
    ) { }

    async signup(signupInput: SignupInput): Promise<AuthResponse> {
        const user = await this.userService.create(signupInput);
        const token = 'asdasd';
        return { token: token, user: user }
    }

    

}
