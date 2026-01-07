import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDTO } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: true })
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {

   @WebSocketServer() wss: Server;

   constructor(
      private readonly messagesService: MessagesService,
      private readonly jwtService: JwtService,
   ) { }

   handleDisconnect(client: Socket) {
      this.messagesService.removeClient(client.id);
   }

   handleConnection(client: Socket) {
      try {
         const email = this.getEmail( client )
         this.messagesService.registerClient( email, client );
         this.wss.emit('clients-updated', this.messagesService.getConnectedClients())
      } catch (error) {
         return
      }
   }

   @SubscribeMessage('msg-from-client')
   messageFromClient(client: Socket, payload: NewMessageDTO) {
      const email = this.getEmail(client);
      this.wss.emit( 'msg-from-server', { id: email, message: payload.message } )
   }

   private getEmail( client: Socket ): string {
      try {
         const token = client.handshake.headers.authentication?.toString().replaceAll(",", "") ?? ""
         const { email } = this.jwtService.verify( token );
         return email
      } catch (error) {
         console.log( error );
         client.disconnect();
         throw new Error("Invalid JWT");
      }
   }
   
}
