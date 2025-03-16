import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class GeoDataDto {

    @IsString()
    @IsNotEmpty()
    Longitud: string;

    @IsString()
    @IsNotEmpty()
    Latitud: string;

    @IsOptional()
    @IsNumber()
    Radio: number;


}
