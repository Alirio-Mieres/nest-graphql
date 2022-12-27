import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Min } from 'class-validator';

@InputType()
export class CreateListInput {

    @Field(() => String, {nullable: false})
    @IsString()
    @IsNotEmpty()
    name: string;
}
