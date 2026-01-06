import { createParamDecorator, ExecutionContext, Header } from "@nestjs/common";

export const RawHeaders = createParamDecorator( 
   ( data: any, ctx: ExecutionContext ) => {
      const req = ctx.switchToHttp().getRequest()

      let headers = {}
      for (let j = 0, i = 1 ; i < req.rawHeaders.length; j+=2, i+=2) {
         const key = req.rawHeaders[j];
         const value = req.rawHeaders[i];
         headers[key] = value
      }

      return headers
   }
)
