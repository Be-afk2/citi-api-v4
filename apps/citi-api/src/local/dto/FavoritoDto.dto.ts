import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

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
  @IsString()
  @IsNotEmpty()
  id: string;
}

class FavoritoEliminar {
  @IsString()
  @IsNotEmpty()
  id: string;
}
