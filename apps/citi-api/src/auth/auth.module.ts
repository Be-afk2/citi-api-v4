import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { User } from 'apps/citi-back/src/entities/user.entity';
import { TipoUser } from 'apps/citi-back/src/entities/TipoUser.entity';
import { Ciudad } from 'apps/citi-back/src/entities/ciudad.entity';
import { JwtStrategy } from './jwt.strategy';
import { Region } from 'apps/citi-back/src/entities/region.entity';
import { Pais } from 'apps/citi-back/src/entities/pais.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1y' },
      }),
    }),
    TypeOrmModule.forFeature([User, TipoUser]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
