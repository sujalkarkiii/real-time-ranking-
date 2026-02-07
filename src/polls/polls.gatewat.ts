import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { PollsService } from "./polls.service";
import { Logger, UseGuards } from "@nestjs/common";
import { Socket } from "socket.io";
import { Namespace } from "socket.io";
import { websocketguard } from "src/websocket-auth-guard";



@UseGuards(websocketguard)
@WebSocketGateway({
  namespace: '/polls/join',
  cors: {
    origin: ['http://localhost:5173','http://localhost:5174'],
    credentials: true,
  },
})
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

  }
  handleDisconnect(client: Socket) {

    this.logger.log(`Disconnected socket id: ${client.id}`)

  }
  
  @SubscribeMessage('join')
  async handleJoin(@ConnectedSocket() client: any) {
    const roomName = client.pollID;
    await client.join(roomName);

    this.logger.debug(`userID: ${client.userID} joined room: ${roomName}`);
    const connectedclient = this.io.adapter.rooms.get(roomName)?.size;
    this.logger.debug(`Total clients in room '${roomName}': ${connectedclient}`);

    const updatedPoll = await this.pollsService.addParticipant({
      pollID: client.pollID,
      userID: client.userID,
      name: client.name,
    });

    this.io.to(roomName).emit('poll_updated', updatedPoll);
  }



  @SubscribeMessage('start-poll')
  async startpoll(@ConnectedSocket() client): Promise<void> {

    const updatedPoll = await this.pollsService.startpoll(client.pollID);
    console.log(client.pollID)
    console.log("pol has started")
    this.io.to(client.pollID).emit("poll-started", updatedPoll)
  }

  @SubscribeMessage('vote')
  async vote(
    @MessageBody() data: { nomination: string },
    @ConnectedSocket() client: any,
  ): Promise<void> {
    const updatedpoll = await this.pollsService.castvote({
      
      name: client.name,
      userID: client.userID,
      pollID: client.pollID,
      nomination: data.nomination
      
    }
  )


    this.io.to(client.pollID).emit("Vote", updatedpoll);
  }

  @SubscribeMessage('stop-poll')
  async result(
    // @MessageBody() data: { nomination: string },
    @ConnectedSocket() client: any,
  ): Promise<void> {
    const updatedpoll = await this.pollsService.computeResults(client.pollID)
    this.io.to(client.pollID).emit("Result", updatedpoll.rankings)

  }






}

