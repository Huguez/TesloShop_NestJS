import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
   imports: [
      ConfigModule.forRoot(),
      TypeOrmModule.forRoot({
         type: 'postgres',
         host: 'localhost',
         port: 5432,
         database: 'Teslodb',
         username: 'postgres',
         password: 'admin123',
         autoLoadEntities: true,
         synchronize: true,
      })
   ],
   controllers: [],
   providers: [],
   exports: []
})
export class AppModule { }
console.log( process.env.DB_USER );