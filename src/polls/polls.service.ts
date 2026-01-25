import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreatePollFields, JoinPollFields, RejoinPollFields } from "./types"
import { pollsRepository } from './polls.repository';
import { createPollID, createUserID } from 'src/ids';

@Injectable()
export class PollsService {
    private readonly logger= new Logger(PollsService.name)
    constructor(private readonly pollsrepo: pollsRepository,
        private readonly jwtservice: JwtService) { }


// this function is for creating the polls to vote//

async create(field: CreatePollFields) {
        const pollID = createPollID();
        const userID = createUserID()

        const createdPoll = await this.pollsrepo.createPOll({
            ...field,
            pollID,
            userID,
        });
        this.logger.log(field)
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
//function for creating the polls to vote ends here//


    async join(field: JoinPollFields) {

        const userId = createUserID()
        const joinedpoll = await this.pollsrepo.joinpoll(field.pollID)

        this.logger.log(userId)

        const signedString = this.jwtservice.sign(
            {
                pollID: joinedpoll.id,
                name: field.name,
            },
            {
                subject: userId,
            },
        );
        return {
            poll: joinedpoll,
            accessToken: signedString
        }
    }



    async rejoinPoll(fields: RejoinPollFields) {
        const joinedPoll = await this.pollsrepo.addparticipent(fields);
    }

}
