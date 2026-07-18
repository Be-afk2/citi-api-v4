import {
  IsString,
  IsNumber,
  IsDate,
  IsNotEmpty,
  Length,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class EditarEventoDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  @IsOptional()
  @Length(3, 100)
  Nombre: string;

  @IsString()
  @IsOptional()
  Longitud: string;

  @IsString()
  @IsOptional()
  Latitud: string;

  @IsString()
  @IsOptional()
  @Length(3, 100)
  Organizador: string;

  @IsString()
  @IsOptional()
  @Length(10, 500)
  Descripcion: string;

  @IsDate()
  @IsOptional()
  FechaInicio: Date;

  @IsDate()
  @IsOptional()
  FechaFin: Date;

  @IsBoolean()
  @IsOptional()
  Activo: boolean;
}
