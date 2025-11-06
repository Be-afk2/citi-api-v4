import { Module } from '@nestjs/common';
import { CitiBackController } from './citi-back.controller';
import { CitiBackService } from './citi-back.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Ciudad } from './entities/ciudad.entity';
import { Etiquetas } from './entities/etiquetas.entiy';
import { Evento } from './entities/evento.entity';
import { FotosEvento } from './entities/fotosEvento.entity';
import { FotosLocal } from './entities/fotoslocal.entity';
import { Interacion } from './entities/interacion.entity';
import { Local } from './entities/local.entity';
import { Pais } from './entities/pais.entity';
import { Region } from './entities/region.entity';
import { TipoUser } from './entities/TipoUser.entity';
import { User } from './entities/user.entity';
import { GeoData } from './entities/geoData.entity';
import { LocalTipo } from './entities/localTipo.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        Ciudad,
        Etiquetas,
        Evento,
        FotosEvento,
        FotosLocal,
        Interacion,
        Local,
        Pais,
        Region,
        TipoUser,
        User,
        GeoData,
        LocalTipo,
      ],
      synchronize: true,
    }),
  ],
  controllers: [CitiBackController],
  providers: [CitiBackService],
})
export class CitiBackModule {}
