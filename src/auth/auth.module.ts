import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
   controllers: [AuthController],
   providers: [AuthService, JwtStrategy ],
   imports: [
      ConfigModule,
      TypeOrmModule.forFeature([User]),
      PassportModule.register({
         defaultStrategy: 'jwt'
      }),
      JwtModule.registerAsync({
         imports: [ ConfigModule ],
         inject:  [ ConfigService ],
         useFactory: ( cs: ConfigService ) => {
            const  key = cs.get("SECRET_KEY_JWT")
            
            if ( !key ) {
               throw new Error("SECRET KEY JWT is required")
            }

            return {
               secret: cs.get("SECRET_KEY_JWT"),
               signOptions: {
                  expiresIn: '2h'
               }
            }
         }
      }),
   ],
   exports: [
      AuthService,
      TypeOrmModule,
      JwtStrategy,
      PassportModule,
      JwtModule,
   ]
})
export class AuthModule { }
