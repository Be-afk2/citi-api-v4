import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class GeoRaData {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Cordenadas)
  @IsNotEmpty()
  Cordenadas: Cordenadas[];
}

class Cordenadas {
  @IsString()
  @IsNotEmpty()
  longitud: string;

  @IsString()
  @IsNotEmpty()
  latitud: string;
}
