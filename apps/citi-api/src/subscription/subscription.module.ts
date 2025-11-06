import { SubscriptionService } from './subscription.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { Local } from 'apps/citi-back/src/entities/local.entity';
import { LocalTipo } from 'apps/citi-back/src/entities/localTipo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Local, LocalTipo])],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
