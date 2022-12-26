import { registerEnumType } from "@nestjs/graphql";

export enum ValidRolesEnum {
    admin = 'admin',
    user  = 'user',
    superUser = 'superUser'
}

registerEnumType(ValidRolesEnum, {name: 'ValidRoles'})