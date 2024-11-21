import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateLocalDto {



    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    readonly descripcion: string;

    @IsString()
    @IsNotEmpty()
    readonly contacto: string;

    @IsString()
    @IsNotEmpty()
     longitud: string;

    @IsString()
    @IsNotEmpty()
     latitud: string;

    @IsNumber()
    @IsNotEmpty()
    readonly ciudad: number;

}
