import { IsNotEmpty, IsString } from 'class-validator';

export class GetOneDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
