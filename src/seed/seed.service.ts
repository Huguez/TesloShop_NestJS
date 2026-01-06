import { Injectable, Logger } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { hashSync } from 'bcrypt';


@Injectable()
export class SeedService {

   private readonly logger = new Logger("SeedService");

   constructor(
      private readonly productService: ProductsService,
      @InjectRepository(User)
      private readonly userR: Repository<User>,
   ) { }

   async runSeed() {
      try {
         await this.deleteAllTables();

         const user = await this.insertNewUsers();

         await this.insertNewProducts(user);

         return "Seed Executed";
      } catch (error) {
         this.logger.error(error);
         this.productService.handleExceptions(error);
      }
   }

   private async deleteAllTables() {
      await this.productService.deleteAllProducts();

      const queryBuilder = this.userR.createQueryBuilder();

      await queryBuilder
         .delete()
         .where({})
         .execute();
   }

   private async insertNewProducts(user: User) {

      const { products } = initialData;

      const insertPromises: Promise<any>[] = [];

      products.forEach(product => {
         const productPromise = this.productService.create(product, user);
         insertPromises.push(productPromise);
      })

      await Promise.all([...insertPromises]);
   }

   private async insertNewUsers() {
      const { users } = initialData;

      const insertUsers: User[] = [];

      users.forEach(user => {
         const NewUser = this.userR.create({
            ...user,
            password: hashSync(user.password, 2),
         });
         insertUsers.push(NewUser);
      })

      const [_, user] = await this.userR.save(insertUsers);

      return user
   }
}
