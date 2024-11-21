import { Local } from 'apps/citi-back/src/entities/local.entity';
import { GeoModule } from '../geolocalizacion/geo.module';
import { LocalController } from './local.controller';
import { LocalService } from './local.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Local
        ]),

        GeoModule
    ],
    controllers: [LocalController,],
    providers: [LocalService,],
})
export class LocalModule { }
