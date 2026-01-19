import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreatePollFields, JoinPollFields, RejoinPollFields } from "./types"
import { pollsRepository } from './polls.repository';
import { createPollID, createUserID } from 'src/ids';

@Injectable()
export class PollsService {
    constructor(private readonly pollsrepo: pollsRepository,
        private readonly jwtservice: JwtService) { }

    async create(field: CreatePollFields) {
        const pollID = createPollID();
        const userID = createUserID()

        const createdPoll = await this.pollsrepo.createPOll({
            ...field,
            pollID,
            userID,
        });


        // creating signin payload

        const signedindata = this.jwtservice.sign(
            {
                pollID: createdPoll.id,
                name: field.name,
            },
            {
                subject: userID,
            },
        )
        return {
            poll: createdPoll,
            accessToken: signedindata,
        }
    }


    async join(field: JoinPollFields) {

        const userId = createUserID()
        const joinedpoll= await this.pollsrepo.joinpoll(field.pollID)



    const signedString = this.jwtservice.sign(
      {
        pollID: joinedpoll.id,
        name: field.name,
      },
      {
        subject: userId,
      },
    );
        return{
            poll:joinedpoll,
            accessToken:signedString
        }


    }

}
