import { IsOptional, IsString, IsNumber } from 'class-validator';

export class FiltroPaguinadorDto {
  @IsOptional()
  @IsString()
  Nombre: string;

  @IsOptional()
  @IsNumber()
  ciudad: number;

  @IsOptional()
  @IsNumber()
  region: string;

  @IsOptional()
  @IsNumber()
  pais: string;

  @IsNumber()
  Paguina: number;

  @IsNumber()
  Cantidad: number;
}
