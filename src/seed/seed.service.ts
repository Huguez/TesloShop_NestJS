import { Injectable, Logger } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './seed-data';


@Injectable()
export class SeedService {
   
   private readonly logger = new Logger("SeedService");

   constructor(
      private readonly productService: ProductsService
   ){}

   async runSeed() {
      try {
         
         await this.productService.deleteAllProducts()

         const { products } = initialData;

         const insertPromises: Promise<any>[] = [];

         products.forEach( product => {
            const productPromise = this.productService.create( product );
            insertPromises.push(productPromise);
         } )

         await Promise.all( [...insertPromises] );

         return "Seed Executed";
      } catch (error) {
         this.logger.error(error);
         this.productService.handleExceptions( error );
      }
   }

}
