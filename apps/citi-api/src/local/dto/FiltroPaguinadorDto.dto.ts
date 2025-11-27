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
  pais: number;

  @IsNumber()
  Paguina: number;

  @IsNumber()
  Cantidad: number;

  @IsNumber()
  @IsOptional()
  Etiqueta:number;
}
