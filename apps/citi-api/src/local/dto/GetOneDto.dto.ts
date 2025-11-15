import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class GetOneDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
