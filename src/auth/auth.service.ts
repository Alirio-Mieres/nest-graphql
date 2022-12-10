import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginInput, SignupInput } from './dto/inputs';
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

    async login(loginInput: LoginInput): Promise<AuthResponse> {
        const { email, password } = loginInput;
        const user = await this.userService.findOneByEmail(email);

        if( !bcrypt.compareSync(password, user.password)) {
            throw new BadRequestException('Invalid credentials');
        }

        return {
            token: 'asdasd',
            user
        }
    }

    

}
