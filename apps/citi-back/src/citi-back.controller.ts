import { Controller, Get } from '@nestjs/common';
import { CitiBackService } from './citi-back.service';

@Controller()
export class CitiBackController {
  constructor(private readonly citiBackService: CitiBackService) {}

  @Get()
  getHello(): string {
    return this.citiBackService.getHello();
  }
}
