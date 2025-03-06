import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";


export class UpdateEtiquetaDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Etiqueta)
    @IsNotEmpty()
    Etiquetas: Etiqueta[];
}

class Etiqueta {
    @IsNumber()
    @IsNotEmpty()
    id: number

    @IsString()
    @IsNotEmpty()
    nombre: string;
}