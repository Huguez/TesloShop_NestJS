import { randomUUID as uuid } from 'crypto';

export const fileNamer = ( 
   req: Express.Request,
   file: Express.Multer.File,
   callback: Function
) => {

   if ( !file ) {
      return callback( new Error("File is Empty"), false );
   }

   const fileExt = file.mimetype.split("/")[1]
   
   const newName  = `${ uuid() }.${ fileExt }`

   callback( null, newName )
}