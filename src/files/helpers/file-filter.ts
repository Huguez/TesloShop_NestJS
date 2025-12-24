
export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function ) => {

   if ( !file ) {
      return callback( new Error("File is Empty"), false );
   }

   const ext = file.mimetype.split("/")[1]
   const validExts = [ 'jpg', 'jpeg', 'png', 'gif' ]

   if ( !validExts.includes( ext ) ) {
      return callback( new Error("Invalid File extension"), false );
   }
   
   callback( null, true )
}