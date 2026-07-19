import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsNotEmpty, IsNumber } from 'class-validator';

export class PreferenciasUser {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Etiqueta)
  @IsNotEmpty()
  Etiquetas: Etiqueta[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Etiqueta)
  @IsNotEmpty()
  EtiquetaEliminar: Etiqueta[];
}

class Etiqueta {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
