import { SubscriptionService } from './subscription.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { LocalModule } from '../local/local.module';

@Module({
  imports: [LocalModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
