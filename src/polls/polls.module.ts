import { Module } from '@nestjs/common';
import { PollsService } from './polls.service';
import { PollsController } from './polls.controller';
import { pollsRepository } from './polls.repository';
import { jwtModule, redisModule } from 'src/modules.config';
import { ConfigModule } from '@nestjs/config';
import { WebsocketGateway } from './polls.gatewat';
import { DataSource } from "typeorm";
import { TypeOrmModule } from '@nestjs/typeorm';
import { polls } from './Entity/polls.entity';

@Module({
  imports:[ConfigModule,redisModule,jwtModule,TypeOrmModule.forFeature([polls])],
  controllers: [PollsController],
  providers: [PollsService,pollsRepository,WebsocketGateway],
})
export class PollsModule {}













