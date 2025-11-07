import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return {
      Name: 'Citi-api',
      Message: 'Uno de los mejores servicios API para ciudades turísticas',
      Version: '0.0.10',
      Developers: [
        {
          name: 'BE._.',
        },
      ],
    };
  }
}
