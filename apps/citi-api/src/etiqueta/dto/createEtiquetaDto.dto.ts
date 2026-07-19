import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class CrearEtiquetaDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Etiqueta)
  @IsNotEmpty()
  Etiquetas: Etiqueta[];
}

class Etiqueta {
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
