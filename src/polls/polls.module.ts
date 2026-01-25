import { Module } from '@nestjs/common';
import { PollsService } from './polls.service';
import { PollsController } from './polls.controller';
import { pollsRepository } from './polls.repository';
import { jwtModule, redisModule } from 'src/modules.config';
import { ConfigModule } from '@nestjs/config';
import { WebsocketGateway } from './polls.gatewat';

@Module({
  imports:[ConfigModule,redisModule,jwtModule],
  controllers: [PollsController],
  providers: [PollsService,pollsRepository,WebsocketGateway],
})
export class PollsModule {}












