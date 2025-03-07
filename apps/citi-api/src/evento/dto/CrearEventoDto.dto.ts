import { IsString, IsNumber, IsDate, IsNotEmpty, Length } from 'class-validator';

export class CrearEventoDto {
    @IsString()
    @IsNotEmpty()
    @Length(3, 100)
    Nombre: string;

    @IsString()
    @IsNotEmpty()
    Longitud: string;

    @IsString()
    @IsNotEmpty()
    Latitud: string;

    @IsString()
    @IsNotEmpty()
    @Length(3, 100)
    Organizador: string;

    @IsString()
    @IsNotEmpty()
    @Length(10, 500)
    Descripcion: string;

    @IsDate()
    @IsNotEmpty()
    FechaInicio: Date;

    @IsDate()
    @IsNotEmpty()
    FechaFin: Date;
}
