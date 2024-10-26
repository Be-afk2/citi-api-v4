import { Module } from '@nestjs/common';
import { CitiBackController } from './citi-back.controller';
import { CitiBackService } from './citi-back.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

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

      ],
      synchronize: true,
    }),

  ],
  controllers: [CitiBackController],
  providers: [CitiBackService],
})
export class CitiBackModule {}
