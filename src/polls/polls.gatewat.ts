import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { PollsService } from "./polls.service";
import { Logger, UseGuards } from "@nestjs/common";
import { Socket } from "socket.io";
import { Namespace } from "socket.io";
import { websocketguard } from "src/websocket-auth-guard";



@WebSocketGateway({ namespace: 'polls' })
@UseGuards(websocketguard)
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

 logger = new Logger(WebsocketGateway.name)
  constructor(private readonly pollsService: PollsService) { }
  @WebSocketServer() io:Namespace
  // server:Server  for all clients in all namespace


  afterInit() {
    this.logger.log('WebSocket initialized');
  }

    handleConnection(client: Socket) {
      const sockets=this.io.sockets
        this.logger.log(`Client with id: ${client.id} connected`)
      
    }

    
    handleDisconnect(client: Socket) {
    
          this.logger.log(`Disconnected socket id: ${client.id}`);

    }
}