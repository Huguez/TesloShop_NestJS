import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
   
   @IsInt()
   @IsOptional()
   @IsPositive()
   @Type( ()=> Number )
   @ApiProperty()
   size?: number;

   @IsInt()
   @IsOptional()
   @Min( 0 )
   @Type( ()=> Number )
   @ApiProperty()
   page?: number;
}