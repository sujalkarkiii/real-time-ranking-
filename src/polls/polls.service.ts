import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {CreatePollFields,JoinPollFields,RejoinPollFields} from "./types"
import { pollsRepository } from './polls.repository';
import { createPollID, createUserID } from 'src/ids';
@Injectable()
export class PollsService {
constructor (private readonly pollsrepo: pollsRepository,
    private readonly jwtservice:JwtService){}

create(field:CreatePollFields)
{
        const pollid=createPollID();
        const userid=createUserID()

        const createpolldata= await this.pollsrepo. ({
            ...field,pollid,userid
        })
// creating signin payload

const signedindata=this.jwtservice.sign(
    {




    }
)
    return data
}

}
