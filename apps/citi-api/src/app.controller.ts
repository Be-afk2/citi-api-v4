import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return {
      Name : "Citi-api",
      Version : "0.0.8",
      Developers : [{
        name : "BE"
      }]
    }
  }
}
