import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { PollsService } from "./polls.service";
import { Logger } from "@nestjs/common";
import { Socket } from "socket.io";
import { Namespace } from "socket.io";



@WebSocketGateway({ namespace: 'polls' })
export class websocket implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {


  constructor(private readonly logger = new Logger(websocket.name), pollsService: PollsService) { }
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