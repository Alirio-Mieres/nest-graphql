import { createParamDecorator, ExecutionContext, ForbiddenException, InternalServerErrorException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { User } from "src/users/entities/user.entity";
import { ValidRolesEnum } from "../enums/valid-roles.enum";


export const CurrentUser = createParamDecorator(
    (roles: ValidRolesEnum[] = [], context: ExecutionContext) => {

        const ctx = GqlExecutionContext.create( context );
        const user: User = ctx.getContext().req.user;

        if( !user ){
            throw new InternalServerErrorException('No user insede the request - make sure that we used the AuthGuard');
        }

        if( roles.length === 0 ) return user;

        for( const role of user.roles ) {
            if(roles.includes(role as ValidRolesEnum)) {
                return user;
            }
        }

        throw new ForbiddenException(`User ${user.fullName} need a valid role ${roles}`)
});

