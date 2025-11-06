/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Query, NotFoundException } from '@nestjs/common';
import { HomeService } from './home.service';
import { GeoDataDto } from '../geolocalizacion/dto/geoData.dto';
import { User } from 'apps/citi-back/src/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UseAuthUser } from '../auth/decorators/use-auth-user.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles.enum';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) { }

  private ComprobarUser(user: User) {
    if (user.ciudad == undefined) {
      throw new NotFoundException('Usuario sin ciudad asociada');
    }
  }


  @Get('local')
  @UseAuthUser(
    ValidRoles.SuperAdmin,
    ValidRoles.Usuario,
    ValidRoles.Guest

  )
  async homeLocal(@Query() data: GeoDataDto, @GetUser() user: User) {
    this.ComprobarUser(user);
  }



  @Get('evento')
  @UseAuthUser(
    ValidRoles.SuperAdmin,
    ValidRoles.Usuario,
    ValidRoles.Guest

  )
  async homeEvento(@Query() data: GeoDataDto, @GetUser() user: User) {
    this.ComprobarUser(user);


    return this.homeService.homeEvento(data, user);

  }

  @Get('preferencia')
  @UseAuthUser(
    ValidRoles.SuperAdmin,
    ValidRoles.Usuario,

  )
  async GetPreferencias(@Query() data: GeoDataDto, @GetUser() user: User) {

    return await this.homeService.GetPreferencias(user, data);
  }

  // rincon necro turismo

  @Get("necro")
  @UseAuthUser(
    ValidRoles.SuperAdmin,
    ValidRoles.Usuario,
    ValidRoles.Guest
  )
  async homeNecro(@Query() data: GeoDataDto, @GetUser() user: User) {
    this.ComprobarUser(user);

    return this.homeService.homeNecro(data, user);
  }

}
