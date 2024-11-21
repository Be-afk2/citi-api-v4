/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Query } from '@nestjs/common';
import { GeoService } from './geo.service';
import { GeoDataDto } from './dto/geoData.dto';

@Controller('Geo')
export class GeoController {
    constructor(
        private geoService: GeoService
    ){}



    @Get()
    async GetData(@Query() data: GeoDataDto ) {
        return this.geoService.GetData(data);
        
    }

}
