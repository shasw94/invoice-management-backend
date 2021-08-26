import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class GetOrderFilterDto {
    @IsOptional()
    @IsNumber()
    orderNumber?: number;

    @IsOptional()
    @IsDateString()
    date?: string;

    @IsOptional()
    @IsDateString()
    minDateRange?: string;

    @IsOptional()
    @IsDateString()
    maxDateRange?: string;
}