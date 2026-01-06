import { Controller, Post, Body, UseGuards, Get, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RawHeaders } from './decorators/raw-headers.decorator';
import { UserRoleGuard } from './guards/user-role.guard';
import { RolesProtected } from './decorators/roles-protected.decorator';
import { ValidRoles } from './interfaces/valid-roles.interface';
import { Auth } from './decorators/auth.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticationResponse } from './dto/auth-response.dto';



@ApiTags('Auth')
@Controller('auth')
export class AuthController {

   constructor(private readonly authService: AuthService) { }

   @Post("login")
   @ApiResponse({ status: 201, description: "User logged.", type: AuthenticationResponse })
   @ApiResponse({ status: 400, description: "Bad Request - invalid credentials" })
   login(@Body() loginUserDto: LoginUserDto) {
      return this.authService.login(loginUserDto);
   }

   @Post("signIn")
   @ApiResponse({ status: 201, description: "Product was created.", type: AuthenticationResponse })
   @ApiResponse({ status: 400, description: "Bad Request - missing information." })
   signIn(@Body() createAuthDto: CreateUserDto) {
      return this.authService.sigIn(createAuthDto);
   }

   @Get('check-status')
   @ApiResponse({ status: 201, description: "User logged.", type: AuthenticationResponse })
   @ApiResponse({ status: 400, description: "Bad Request - invalid credentials" })
   @Auth()
   checkStatus(@GetUser() user: User) {
      return this.authService.checkStatus(user)
   }

   @Get('private')
   @ApiResponse({ status: 201, description: "Product was got.", type: User })
   @UseGuards(AuthGuard())
   privater(@GetUser() user: User, @RawHeaders() headers: string[]) {

      return {
         ok: true,
         user,
         headers
      }
   }

   @Get('private2')
   @ApiResponse({ status: 201, description: "Product was got.", type: User })
   // @SetMetadata( META_ROLES, [ ValidRoles.admin, ValidRoles.superUser ] )
   @RolesProtected(ValidRoles.admin, ValidRoles.superUser)
   @UseGuards(AuthGuard(), UserRoleGuard)
   private2(@GetUser() user: User) {

      return {
         ok: true,
         user
      }
   }

   @Get('private3')
   @ApiResponse({ status: 201, description: "Product was got.", type: User })
   @Auth(ValidRoles.admin, ValidRoles.standard)
   private3(@GetUser() user: User) {

      return {
         ok: true,
         user
      }
   }

}
