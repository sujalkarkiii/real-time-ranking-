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
  
  
  // for creating  the poll by admin
  @Post()
  create(@Body() createpolldto: CreatePollDto) {
    return this.pollsService.create(createpolldto)
  }

  // for sending Nominee back to frontend 
  @Get(':pollId')
  async sendnominies(@Param('pollId')pollId:string){
    console.log(pollId)
    const remote= await this.pollsService.sendnominee(pollId)
    console.log(remote)
      return remote
  }

// For adding nominee by admin
  @Post('/add')
  Add(@Body() createnomineedto: createnominee) {
    return this.pollsService.addnominee(createnomineedto)
  }
  
  // contoller for users to join poll
  @Post('/join')
  join(@Body() joinpolldto: JoinPollDto) {
    return this.pollsService.join(joinpolldto)
  }
  
  // not necessary used this is for rejoinng just for learning 
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
