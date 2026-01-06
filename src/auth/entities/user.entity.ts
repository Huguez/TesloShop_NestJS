import { Product } from "src/products/entities/product.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("Users")
export class User {

   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column('text', {
      unique: true
   })
   username: string

   @Column('text', {
      unique: true,
   })
   email: string;

   @Column('text', {
      select: false,
   })
   password: string;

   @Column('bool', {
      default: true,
   })
   isActivated: boolean;

   @Column('text', {
      array: true,
      default: [ 'standard' ]
   })
   roles: string[];

   @OneToMany(
      ()=> Product,
      ( product: Product ) => product.user
   )
   product: Product;

   @BeforeInsert()
   checkUpperCase(){
      this.email = this.email.toLowerCase().trim();
   }

   @BeforeUpdate()
   checkUpperCaseUpdate(){
      this.checkUpperCase()
   }

}
