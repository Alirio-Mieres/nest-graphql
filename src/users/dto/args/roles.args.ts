import { ArgsType, Field } from "@nestjs/graphql";
import { IsArray } from "class-validator";
import { ValidRolesEnum } from "src/auth/enums/valid-roles.enum";

@ArgsType()
export class ValidRoles {
    
    @Field(() => [ValidRolesEnum], {nullable: true})
    @IsArray()
    roles: ValidRolesEnum[] = [];
}