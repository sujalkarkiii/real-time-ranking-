import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {CreatePollFields,JoinPollFields,RejoinPollFields} from "./types"
import { pollsRepository } from './polls.repository';

@Injectable()
export class PollsService {
constructor (private readonly pollsrepo: pollsRepository,
    private readonly jwtservice:JwtService){}

create(createpolldto)
{


        
// creating signin payload

const signedindata=this.jwtservice.sign(
    {

    }
)
    return createpolldto
}

}
