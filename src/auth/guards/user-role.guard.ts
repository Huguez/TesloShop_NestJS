import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/roles-protected.decorator';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {

   constructor(
      private readonly reflector: Reflector
   ) { }

   canActivate(
      ctx: ExecutionContext,
   ): boolean | Promise<boolean> | Observable<boolean> {

      const roles: string[] = this.reflector.get( META_ROLES , ctx.getHandler())

      if ( !roles || roles && roles.length === 0 ) {
         return true
      }

      const req = ctx.switchToHttp().getRequest();
      const user: User = req.user;

      if (!user) {
         throw new BadRequestException("User not found (request)")
      }

      if ( !user.roles.some( role => roles.includes( role ) ) ) {
         throw new ForbiddenException( `User: ${ user.email } needs a valid role: (${ roles.toString() }) ` )
      }

      return true
   }

}
