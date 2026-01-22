import { Body, Controller, Logger, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { PollsService } from './polls.service';
import { CreatePollDto } from './dto/create-polls.dto';
import { JoinPollDto } from './dto/join-polls.dto';
import { ControllerAuthGuard } from './controller-auth.guard';
import type { RequestWithAuth } from './types';


@UsePipes(new ValidationPipe())
@Controller('polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) { }
  @Post()
  create(@Body() createpolldto: CreatePollDto) {
    return this.pollsService.create(createpolldto)
  }




  @Post('/join')
  join(@Body() joinpolldto: JoinPollDto) {
    return this.pollsService.join(joinpolldto)
  }

  @UseGuards(ControllerAuthGuard)
  @Post('/rejoin')
  rejoin(@Req() request: RequestWithAuth) {
    const { userID, pollID, name } = request;
    const result = this.pollsService.rejoinPoll({
      name,
      pollID,
      userID,
    });

    return result;
  }

}




// ... is a spread opearator=>
/*
      const arr1 = [1, 2, 3];
      const arr2 = [...arr1, 4, 5];
      [1, 2, 3, 4, 5]


        
 */