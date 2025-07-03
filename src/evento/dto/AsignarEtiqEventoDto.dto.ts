import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class AsignarEtiqEventoDto {
  @IsString()
  @IsNotEmpty()
  idEvento: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EtiquetaAgregar)
  @IsNotEmpty()
  EtiquetaAgregar: EtiquetaAgregar[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EtiquetaEliminar)
  @IsNotEmpty()
  EtiquetaEliminar: EtiquetaEliminar[];
}

class EtiquetaAgregar {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}

class EtiquetaEliminar {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
