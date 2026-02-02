import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AddParticipantData, CreatePollFields, JoinPollFields, RejoinPollFields, SubmitRankingsFields } from "./types"
import { pollsRepository } from './polls.repository';
import { createPollID, createUserID } from 'src/ids';
import { Poll } from 'shared/polls-types';
import { createnominee } from './dto/add-nominee.dto';

@Injectable()
export class PollsService {
    private readonly logger = new Logger(PollsService.name)
    constructor(private readonly pollsrepo: pollsRepository,
        private readonly jwtservice: JwtService) { }


    async sendnominee(pollID:string) {
        const remote=await this.pollsrepo.sendnominee(pollID)
        return remote
    }



    async addnominee(field: createnominee) {
        await this.pollsrepo.addnomines(field)
    }







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


        const signedString = this.jwtservice.sign(
            {
                pollID: joinedpoll.id,
                name: field.name,
            },
            {
                subject: userId,
            },
        )
        return {
            userId: userId,
            poll: joinedpoll,
            accessToken: signedString
        }
    }

    async addParticipant(addParticipant: AddParticipantData) {
        return this.pollsrepo.addparticipent(addParticipant)
    }





    async removeParticipant(
        pollID: string,
        userID: string,
    ): Promise<Poll | void> {
        const poll = await this.pollsrepo.joinpoll(pollID);

        if (!poll.hasStarted) {
            const updatedPoll = await this.pollsrepo.removeParticipant(
                pollID,
                userID,
            );
            return updatedPoll;
        }
    }

    async getPoll(pollID: string): Promise<Poll> {
        return this.pollsrepo.joinpoll(pollID);
    }

    async rejoinPoll(fields: RejoinPollFields) {
        const joinedPoll = await this.pollsrepo.addparticipent(fields);
        return joinedPoll
    }

    async startpoll(pollID: string) {
        const joinedPoll = await this.pollsrepo.starpoll(pollID);
        return joinedPoll
    }




    async castvote(rankingData: SubmitRankingsFields) {
        const hasPollStarted = this.pollsrepo.addParticipantRankings(rankingData)
    }





    async computeResults(pollID: string): Promise<Poll> {

        const get_result = await this.pollsrepo.getresult(pollID)
        this.logger.log(get_result)
        return get_result

    }

    // async cancelPoll(pollID: string): Promise<void> {
    //     await this.pollsrepo.deletePoll(pollID);
    // }
}
