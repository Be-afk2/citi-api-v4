/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { UseAuthUser } from '../auth/decorators/use-auth-user.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles.enum';
import { GetOneDto } from '../local/dto/GetOneDto.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private DashboardService: DashboardService) {}

  @UseAuthUser(ValidRoles.SuperAdmin)
  @Get('local')
  async GetLocales() {
    return this.DashboardService.GetLocaltop();
  }

  @UseAuthUser(ValidRoles.SuperAdmin)
  @Get('etiqueta')
  async Getetiqueta() {
    return this.DashboardService.GetEtiquetasTop();
  }

  @UseAuthUser(ValidRoles.SuperAdmin)
  @Get('mapa')
  async GetMapa(@Query() data: GetOneDto, @Query() radio: number) {
    return this.DashboardService.GetMapaCalor(data, radio);
  }
}
