import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsString()
  apodo?: string;

  @IsDate()
  @IsOptional()
  fechaNacimiento?: Date;

  @IsOptional()
  @IsBoolean()
  mostrarContenidoMayor?: boolean;
}
