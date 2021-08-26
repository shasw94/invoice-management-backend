import { IsOptional, IsString } from "class-validator";

export class GetStoreFilterDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    search?: string;
}