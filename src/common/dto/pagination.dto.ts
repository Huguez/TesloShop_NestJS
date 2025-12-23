import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
   
   @IsInt()
   @IsOptional()
   @IsPositive()
   @Type( ()=> Number )
   size?: number;

   @IsInt()
   @IsOptional()
   @Min( 0 )
   @Type( ()=> Number )
   page?: number;
}