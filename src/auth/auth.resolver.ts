import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput, LoginInput } from './dto/inputs';
import { AuthResponse } from './dto/types/auth-response.types';

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
  
}