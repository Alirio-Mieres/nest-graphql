import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

import { SignupInput, LoginInput } from './dto/inputs';
import { AuthResponse } from './dto/types/auth-response.types';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ValidRoles } from './enums/valid-roles.enum';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

    @Mutation( () => AuthResponse, {name: 'signup'})
    async signup(@Args('signupInput') signupInput: SignupInput): Promise<AuthResponse> {
      return this.authService.signup(signupInput);
    }

    @Mutation( () => AuthResponse, {name: 'login'})
    async login(@Args('loginInput') loginInput: LoginInput): Promise<AuthResponse> {
      return this.authService.login(loginInput);
    }

    @Mutation(() => AuthResponse, {name: 'revalite'})
    @UseGuards( JwtAuthGuard )
    revalidateToken(
      @CurrentUser(/*[ ValidRoles.admin ]*/) user: User
    ): AuthResponse {
      return this.authService.revalidateToken(user);
    }
  
}
