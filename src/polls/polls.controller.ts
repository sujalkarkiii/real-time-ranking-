import { Body, Controller, Get, Logger, Param, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { PollsService } from './polls.service';
import { CreatePollDto } from './dto/create-polls.dto';
import { JoinPollDto } from './dto/join-polls.dto';
import { ControllerAuthGuard } from './controller-auth.guard';
import type { RequestWithAuth } from './types';
import { createnominee } from './dto/add-nominee.dto';


@UsePipes(new ValidationPipe())
@Controller('/polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) { }
  
  @Post()
  create(@Body() createpolldto: CreatePollDto) {
    return this.pollsService.create(createpolldto)
  }

  @Get(':pollId')
  sendnominies(@Param('pollId')pollId:string){
      return this.pollsService.sendnominee(pollId)
  }


  @Post('/add')
  Add(@Body() createnomineedto: createnominee) {
    return this.pollsService.addnominee(createnomineedto)
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
