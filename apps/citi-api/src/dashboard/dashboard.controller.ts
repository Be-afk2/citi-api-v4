/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { UseAuthUser } from '../auth/decorators/use-auth-user.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles.enum';
import { UpdateEtiquetaDto } from '../etiqueta/dto/UpdateEtiquetaDto.dto';

@Controller("dashboard")
export class DashboardController {
  constructor(private DashboardService: DashboardService) { }

  @UseAuthUser(ValidRoles.SuperAdmin)
  @Get("local")
  async GetLocales() {
    return this.DashboardService.GetLocaltop();
  }

  @UseAuthUser(ValidRoles.SuperAdmin)
  @Get("etiqueta")
  async Getetiqueta() {
    return this.DashboardService.GetEtiquetasTop();
  }

}
