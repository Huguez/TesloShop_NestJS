import { Controller, Post, Body, Get, Param, ParseUUIDPipe, Delete, Query, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';


@Controller('product')
@Auth()
export class ProductsController {
   
   constructor(
      private readonly productsService: ProductsService
   ) { }
   
   @Post()
   @Auth( ValidRoles.admin )
   async create(@Body() createProductDto: CreateProductDto, @GetUser() user: User ) {
      return await this.productsService.create(createProductDto, user);
   }

   @Put(":id" )
   async update( @Param( "id", ParseUUIDPipe ) id: string, @Body() updateProductDto: UpdateProductDto, @GetUser() user: User ){
      return await this.productsService.update( id, updateProductDto, user )
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
