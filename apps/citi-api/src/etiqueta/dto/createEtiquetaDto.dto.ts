import { Type } from 'class-transformer';
import {  IsArray, IsNotEmpty,  IsNumber, IsObject, IsString, Validate, ValidateNested} from 'class-validator';

export class CrearEtiquetaDto {


    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Etiqueta)
    @IsNotEmpty()
    Etiquetas: Etiqueta[];

}

class Etiqueta{
    @IsString()
    @IsNotEmpty()
    nombre: string;
}
