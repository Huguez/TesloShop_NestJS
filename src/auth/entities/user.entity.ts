import { Exclude } from "class-transformer";
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

   @BeforeInsert()
   checkUpperCase(){
      this.email = this.email.toLowerCase().trim();
   }

   @BeforeUpdate()
   checkUpperCaseUpdate(){
      this.checkUpperCase()
   }

}
