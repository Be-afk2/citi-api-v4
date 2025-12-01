/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/UpdateUserDto.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UseAuthUser } from '../auth/decorators/use-auth-user.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles.enum';
import { User } from 'apps/citi-back/src/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { PreferenciasUser } from './dto/PreferenciaDto.dto';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseAuthUser(
    ValidRoles.SuperAdmin,
    ValidRoles.Usuario,
    ValidRoles.Guest,
    //rol de invitado sin token
  )
  @Get('test')
  test(@GetUser() user: User) {
    return user;
  }

  @Put('preferencia')
  async updatePreferencia(
    @Body() data: PreferenciasUser,
    @GetUser() user: User,
  ) {
    return await this.userService.updatePreferencia(data, user);
  }

  @UseAuthUser(ValidRoles.SuperAdmin, ValidRoles.Usuario)
  @Put()
  async update(@Body() data: UpdateUserDto, @GetUser() user: User) {
    return await this.userService.update(data, user);
  }

  @UseAuthUser(
    ValidRoles.SuperAdmin,
    ValidRoles.Usuario,

  )
  @Get('preferencia')
  async GetPreferencia(@GetUser() user: User) {
    return await this.userService.getPreferences(user);
  }

  // rincon invitado
}
