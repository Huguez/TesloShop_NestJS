
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class LoginUserDto {

   @IsString()
   @IsEmail()
   @ApiProperty()
   email: string;

   @IsString()
   @MinLength(5)
   @MaxLength(15)
   @Matches(
      /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message: 'The password must have a Uppercase, lowercase letter and a number'
   })
   @ApiProperty()
   password: string;
}
