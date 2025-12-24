import { Controller, Post, Body, Get, Param, ParseUUIDPipe, Delete, Query, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UpdateProductDto } from './dto/update-product.dto';


@Controller('product')
export class ProductsController {

   constructor(
      private readonly productsService: ProductsService
   ) { }

   @Post()
   async create(@Body() createProductDto: CreateProductDto) {
      return await this.productsService.create(createProductDto);
   }

   @Put(":id" )
   async update( @Param( "id", ParseUUIDPipe ) id: string, @Body() updateProductDto: UpdateProductDto ){
      return await this.productsService.update( id, updateProductDto )
   }

   @Get(":term")
   async getById( @Param( "term" ) term: string ){
      return await this.productsService.findOne( term );
   }

   @Get()
   async getAll( @Query() pagination: PaginationDto ){
      return await this.productsService.findAll( pagination );
   }

   @Delete(":id")
   async deleteOne( @Param( "id", ParseUUIDPipe ) id: string  ){
      return this.productsService.remove( id );
   }
}
