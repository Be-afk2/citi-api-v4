import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetOneIntedto {
    @IsString()
    @IsOptional()
    readonly idLocal: string;

    @IsNumber()
    @IsOptional()
    readonly idEvento: number;

    @IsBoolean()
    @IsNotEmpty()
    local:boolean
}
