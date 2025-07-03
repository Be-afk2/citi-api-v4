import { Pais } from 'src/entities/pais.entity';
import { GeoController } from './geo.controller';
import { GeoService } from './geo.service';

import { Module } from '@nestjs/common';
import { Ciudad } from 'src/entities/ciudad.entity';
import { Region } from 'src/entities/region.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { GeoData } from 'src/entities/geoData.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pais, Ciudad, Region, User, GeoData])],
  controllers: [GeoController],
  providers: [GeoService],
  exports: [GeoService],
})
export class GeoModule {}
