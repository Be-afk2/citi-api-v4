import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class FavoritoDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FavoritoAgregar)
  @IsNotEmpty()
  FavoritoAgregar: FavoritoAgregar[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FavoritoEliminar)
  @IsNotEmpty()
  FavoritoEliminar: FavoritoEliminar[];
}

class FavoritoAgregar {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}

class FavoritoEliminar {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
