import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
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
  @WebSocketServer() io: Namespace
  // server:Server  for all clients in all namespace


  afterInit() {
    this.logger.log('WebSocket initialized');
  }

 async handleConnection(client) {
    this.logger.log(`Client with id: ${client.id} connected`)
    const sockets = this.io.sockets
    this.logger.debug(`Number of connected sockets: ${sockets.size}`)
    const roomName = client.pollID;
   await client.join(roomName);
    this.logger.debug(
      `userID: ${client.userID} joined room with name: ${roomName}`,
    )
  const connectedclient=this.io.adapter.rooms.get(roomName)?.size

    this.logger.debug(
      `Total clients connected to room '${roomName}': ${connectedclient}`
    );
  const updatedPoll = await this.pollsService.addParticipant({
      pollID: client.pollID,
      userID: client.userID,
      name: client.name,
    })
    this.io.to(roomName).emit('poll_updated', updatedPoll)
  }


  handleDisconnect(client: Socket) {

    this.logger.log(`Disconnected socket id: ${client.id}`)

  }
}


@SubscribeMessage('vote')
