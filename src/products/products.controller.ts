import { Controller, Post, Body, Get, Param, ParseUUIDPipe, Delete, Query, Put, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { Product } from './entities/product.entity';


@ApiTags('Products')
@Controller('product')
@Auth()
export class ProductsController {

   constructor(
      private readonly productsService: ProductsService
   ) { }

   @Post()
   @Auth(ValidRoles.admin)
   @ApiResponse({ status: HttpStatus.CREATED, description: "Product was created.", type: Product })
   @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request - missing information." })
   @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden - Token related." })
   async create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
      return await this.productsService.create(createProductDto, user);
   }

   @Put(":id")
   @ApiResponse({ status: HttpStatus.ACCEPTED, description: "Product was Got.", type: Product })
   @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request - missing information." })
   async update(@Param("id", ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateProductDto, @GetUser() user: User) {
      return await this.productsService.update(id, updateProductDto, user)
   }

   @Get(":term")
   @ApiResponse({ status: HttpStatus.ACCEPTED, description: "Product was Got.", type: Product })
   @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad Request - missing information." })
   async getById( @Param("term") term: string) {
      return await this.productsService.findOne(term);
   }

   @Get()
   @ApiResponse({ status: HttpStatus.ACCEPTED, description: "Products were Got."})
   async getAll(@Query() pagination: PaginationDto) {
      return await this.productsService.findAll(pagination);
   }

   @Delete(":id")
   @ApiResponse({ status: HttpStatus.ACCEPTED, description: "Product was Deleted." })
   async deleteOne(@Param("id", ParseUUIDPipe) id: string) {
      return this.productsService.remove(id);
   }
}
