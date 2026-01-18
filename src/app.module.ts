import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PollsModule } from './polls/polls.module';
// import { RedisModule } from './redis/redis.module';
import { ConfigModule } from '@nestjs/config';
// , RedisModule

@Module({
  imports: [ConfigModule.forRoot(),PollsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
