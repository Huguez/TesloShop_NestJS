import { Controller, Post, Body, Get, Param, ParseUUIDPipe, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('product')
export class ProductsController {

   constructor(
      private readonly productsService: ProductsService
   ) { }

   @Post()
   create(@Body() createProductDto: CreateProductDto) {
      return this.productsService.create(createProductDto);
   }

   @Get(":id")
   getById( @Param( "id", ParseUUIDPipe ) id: string ){
      return this.productsService.findOne( id );
   }

   @Get()
   getAll( @Query() pagination: PaginationDto ){
      return this.productsService.findAll( pagination );
   }

   @Delete(":id")
   async deleteOne( @Param( "id", ParseUUIDPipe ) id: string  ){
      return this.productsService.remove( id );
   }
}
