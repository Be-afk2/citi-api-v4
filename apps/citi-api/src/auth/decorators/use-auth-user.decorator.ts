import { UseGuards, applyDecorators } from '@nestjs/common';
import { UserRoleGuard } from '../guards/role-guard';
import { ValidRoles } from '../interfaces/valid-roles.enum';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { RoleProtected } from './role-protected.decorator';

/**
 * Esto combina decoradores, en lugar de aplicar linea x linea, queda aplicado en una.
 *
 * 1. Aplica los roles que van por metadta
 * 2. Valida el AuthGuard de toda la vida que conoces y amas
 * 3. Aplica si al usuario no posee los roles de la metadata
 * 4. BONUS: se puede extraer el usuario de la request mediante `@GetUser()`
 *
 *
 * 	`@UseAuthUser(ValidRoles.SuperAdmin)`
 *
 * 	`@Get('privada/admin')`
 *
 * 	`obtenerSecretoAdmin(` `@GetUser()` user:Users ) {
 *
 * 		return 'aplicando secretos ' + user.nombre + 'hizo algo malo  o.o';
 *		}
 */
export const UseAuthUser = (...args: ValidRoles[]) => {
  return applyDecorators(
    RoleProtected(...args),
    UseGuards(JwtAuthGuard, UserRoleGuard),
  );
};
