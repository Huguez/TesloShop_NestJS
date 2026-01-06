import { ApiProperty } from "@nestjs/swagger";
import { User } from "../entities/user.entity";

export class AuthenticationResponse{
   @ApiProperty()
   user: User;

   @ApiProperty()
   token: string;
}