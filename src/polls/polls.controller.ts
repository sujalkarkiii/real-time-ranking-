import { Body, Controller, Logger, Post } from '@nestjs/common';
import { PollsService } from './polls.service';
import { CreatePollDto } from './dto/create-polls.dto';
import { JoinPollDto } from './dto/join-polls.dto';

@Controller('polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}
    @Post()
    create( @Body() createpolldto:CreatePollDto){
       return this.pollsService.create(createpolldto)
    }   



    
    @Post('/join')
    join(@Body() joinpolldto:JoinPollDto){
      return this.pollsService.join(joinpolldto)
    }    


    @Post('/rejoin')
    rejoin(){
      return "this will create for rejoin"
    }

}




// ... is a spread opearator=>
/*
      const arr1 = [1, 2, 3];
      const arr2 = [...arr1, 4, 5];
      [1, 2, 3, 4, 5]


        
 */