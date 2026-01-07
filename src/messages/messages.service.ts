import { Injectable } from '@nestjs/common';
import { Socket } from "socket.io"

interface ConnectedClients {
   [id: string]: Socket
}

@Injectable()
export class MessagesService {

   private connectedClients: ConnectedClients = {}

   registerClient( email: string, client: Socket ){
      this.connectedClients[ email ] = client;
   }
   
   removeClient( id: string ){
      const aux = { ...this.connectedClients }
      delete aux[ id ];
      this.connectedClients = { ...aux }
   }

   getConnectedClients(): string[] {
      return Object.keys( this.connectedClients )
   }

   
}