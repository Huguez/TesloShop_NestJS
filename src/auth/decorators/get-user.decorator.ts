import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetUser = createParamDecorator( ( data: string[] | undefined, ctx: ExecutionContext ) => {

   const req  = ctx.switchToHttp().getRequest();
   const user = req.user;

   if ( !user ) {
      throw new InternalServerErrorException("User not found (request)")
   }
   
   if ( data && data.length > 0 ) {

      let userAux = {}
      
      data.forEach( element => {
         if ( !!user[element]  ) {
            userAux[ element ] = user[element]
         }
      });

      return userAux
      
   }



   return user;
} );