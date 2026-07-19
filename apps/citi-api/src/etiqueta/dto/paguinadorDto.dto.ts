import { IsNumber } from 'class-validator';

export class PaguinadorDto {
  @IsNumber()
  Paguina: number;

  @IsNumber()
  Cantidad: number;
}
