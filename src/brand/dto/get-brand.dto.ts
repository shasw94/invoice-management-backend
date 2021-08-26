import { IsOptional, IsString } from "class-validator";

export class GetBrandFilterDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    search?: string;
}