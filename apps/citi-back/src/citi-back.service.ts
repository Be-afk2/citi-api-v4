import { Injectable } from '@nestjs/common';

@Injectable()
export class CitiBackService {
  getHello(): string {
    return 'Hello World!';
  }
}
