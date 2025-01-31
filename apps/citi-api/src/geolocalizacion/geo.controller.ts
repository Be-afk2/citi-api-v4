/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { GeoService } from './geo.service';
import { GeoDataDto } from './dto/geoData.dto';
import { User } from 'apps/citi-back/src/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UseAuthUser } from '../auth/decorators/use-auth-user.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('Geo')
@UseGuards(JwtAuthGuard)
export class GeoController {
    constructor(
        private geoService: GeoService
    ){}

    @UseAuthUser(
        ValidRoles.SuperAdmin,
        ValidRoles.Usuario,
    )
    @Get()
    async GetData(@Query() data: GeoDataDto ) {
        return this.geoService.GetData(data);
        
    }

    @UseAuthUser(
        ValidRoles.SuperAdmin,
        ValidRoles.Usuario,
    )
    @Post('user')
    async SaveDataUser(@Body() data: GeoDataDto,@GetUser() user: User ) {
        return this.geoService.SaveDataUser(data,user);
    }

    

}
