import { Controller, Post, Body, Get, Param, ParseUUIDPipe, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

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
   getAll(){
      return this.productsService.findAll();
   }

   @Delete(":id")
   async deleteOne( @Param( "id", ParseUUIDPipe ) id: string  ){
      return this.productsService.remove( id );
   }
}
