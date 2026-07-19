import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  Correo: string;

  @IsString()
  @IsNotEmpty()
  Pass: string;
}
