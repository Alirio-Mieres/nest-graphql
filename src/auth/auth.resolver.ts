import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput } from './dto/inputs/singup.input';
import { AuthResponse } from './dto/types/auth-response.types';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

    @Mutation( () => AuthResponse, {name: 'signup'})
    async signup(@Args('signupInput') signupInput: SignupInput): Promise<AuthResponse> {
      return this.authService.signup(signupInput);
    }

    
  
}
