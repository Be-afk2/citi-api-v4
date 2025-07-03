import {
  IsEmail,
  IsNotEmpty,
  isNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  Correo: string;

  @IsString()
  @IsNotEmpty()
  Pass: string;
}
