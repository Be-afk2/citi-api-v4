import { Pais } from 'apps/citi-back/src/entities/pais.entity';
import { GeoController } from './geo.controller';
import { GeoService } from './geo.service';

import { Module } from '@nestjs/common';
import { Ciudad } from 'apps/citi-back/src/entities/ciudad.entity';
import { Region } from 'apps/citi-back/src/entities/region.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'apps/citi-back/src/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Pais,
            Ciudad,
            Region,
            User
        ]),
    ],
    controllers: [GeoController,],
    providers: [GeoService,],
    exports: [GeoService], 
})
export class GeoModule { }
