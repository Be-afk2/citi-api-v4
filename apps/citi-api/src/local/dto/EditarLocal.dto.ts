import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class EditarLocalDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion: string;

  @IsString()
  @IsOptional()
  contacto: string;

  @IsString()
  @IsOptional()
  longitud: string;

  @IsString()
  @IsOptional()
  latitud: string;

  @IsBoolean()
  @IsOptional()
  Habilitar: boolean;
}
