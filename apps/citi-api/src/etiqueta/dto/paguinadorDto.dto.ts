import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class PaguinadorDto {


    @IsNumber()
    Paguina: number;
  
    @IsNumber()
    Cantidad: number;
  


}
