import { IsNumber, IsOptional, IsString } from "class-validator";


export class FiltroDto {

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
    pais: string;
}


