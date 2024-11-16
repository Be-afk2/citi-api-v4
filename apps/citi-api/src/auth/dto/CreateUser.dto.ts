import { IsEmail, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {

    @IsString()
    nombre: string;

    @IsString()
    apellido: string;

	@IsString()
	@IsEmail()
	correo: string;
	
	@IsString()
	@MinLength(3)
	password: string;

}
