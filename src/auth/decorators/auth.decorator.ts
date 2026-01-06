
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ValidRoles } from '../interfaces/valid-roles.interface';
import { RolesProtected } from './roles-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';

export function Auth(...roles: ValidRoles[]) {
   return applyDecorators(
      RolesProtected( ...roles ),
      UseGuards(AuthGuard(), UserRoleGuard),
   );
}
