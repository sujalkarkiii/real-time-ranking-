import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PollsModule } from './polls/polls.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot({
     type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [],
      synchronize: true,
  }),ConfigModule.forRoot(),PollsModule,RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
