import { IsNumber } from 'class-validator';

export class GetOneDtoNumber {
  @IsNumber()
  id: number;
}
