import { Module } from '@nestjs/common';
import { PollsService } from './polls.service';
import { PollsController } from './polls.controller';

@Module({
  controllers: [PollsController],
  providers: [PollsService],
})
export class PollsModule {}


// provider are initiated only when required after the modules are registered


/*
There is diff in definig imports,providers,etc in @modul Decorator and in the class methos
in decorator than it is static means everything is defined at compile time in the @module decorator nestjs read this when building the dependecy graph at startup.
we cannoy use this for async logic.

inside the class means dynamic or at  run time
*/