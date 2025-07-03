import {
  ExecutionContext,
  NotFoundException,
  createParamDecorator,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';

/**
 * Esto sirve para extraer algun valor del user, dentro del metodo del controller
 *
 * `ALERTA`: esto solo es valido si configuramos el jwtstrategy para que consulte al usuario
 * ```typescript
 *  @UseGuard(JwtAuthGuard)
 *  @Get('crear/estudiante')
 *  crear_estudiante(@GetUser() user:Users){
 * 	......
 *  }
 * ```
 */
export const GetUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;

    if (!user) throw new NotFoundException('User not found');
    return !data ? user : user[data];
  },
);
