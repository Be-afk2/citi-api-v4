import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { META_ROLES } from '../decorators/role-protected.decorator';
import { User } from 'src/entities/user.entity';

type GuardReturn = boolean | Promise<boolean> | Observable<boolean>;

/** Guardia personalizado, si tenemos algun `ROL` aplicado como `Metadata`
 *
 * entonces empieza a validar el usuario detectado por el request
 *
 * si no detecta errores, pasa normal
 */
@Injectable()
export class UserRoleGuard implements CanActivate {
  private readonly logger = new Logger('RoleGuard');
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): GuardReturn {
    // * Extraemos los roles desde la metadata
    const validRoles: number[] = this.reflector.getAllAndOverride(META_ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);
    this.logger.log(`Roles aplicados: ${validRoles.length}`);

    // * Validacion del array del decorator
    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    // * Extraccion del usuario REQ
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user) throw new BadRequestException('User not found');

    // * Verificacion roles
    this.logger.log(`Usuario de tipo: ${user.tipoUser.tipo}`);
    if (validRoles.includes(Number(user.tipoUser.id))) return true;

    // ! Punto sin retorno :c
    throw new ForbiddenException(
      'Usuario ' + user.nombre + ' no tiene acceso a este recurso',
    );
  }
}
