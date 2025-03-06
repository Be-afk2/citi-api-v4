import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";

export class AsignarEtiquetaDto {
    @IsString()
    @IsNotEmpty()
    idLocal: string;


    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Etiqueta)
    @IsNotEmpty()
    Etiquetas: Etiqueta[];

}

class Etiqueta {
    @IsNumber()
    @IsNotEmpty()
    id: number;

}