import { IsOptional, IsString } from "class-validator";

export class GetStoreFilterDto {
    @IsOptional()
    @IsString()
    search?: string;
}