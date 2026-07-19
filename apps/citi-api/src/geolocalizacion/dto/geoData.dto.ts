import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class GeoDataDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  Longitud: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  Latitud: string;

  @IsOptional()
  @IsNumber()
  Radio: number;
}
