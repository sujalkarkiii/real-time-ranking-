import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PollsModule } from './polls/polls.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis.module';

@Module({
  imports: [ConfigModule.forRoot(),PollsModule,RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
