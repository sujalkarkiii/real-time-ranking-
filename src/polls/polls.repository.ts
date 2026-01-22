import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";
import { IORedisKey } from "src/redis.module";
import { AddParticipantData, CreatePollData } from "./types";
import { Poll } from "shared/polls-types";
import { promises } from "dns";


@Injectable()
export class pollsRepository {
    private readonly ttl: string;
    private readonly logger = new Logger(pollsRepository.name);


    constructor(
        configservice: ConfigService,
        @Inject(IORedisKey) private readonly redisClient: Redis
    ) {
        this.ttl = configservice.get('POLL_DURATION', '3600');
    }

    async createPOll({ votesPerVoter, topic, pollID, userID }: CreatePollData): Promise<Poll> {
        const initialPoll = {
            id: pollID,
            topic,
            votesPerVoter,
            participants: {},
            nominations: {},
            rankings: {},
            results: [],
            adminID: userID,
            hasStarted: false,
        };


        const key = `polls:${pollID}`;

        try {
            await this.redisClient
                .multi([
                    ['send_command', 'JSON.SET', key, '.', JSON.stringify(initialPoll)],
                    ['expire', key, this.ttl],
                ])
                .exec();
            return initialPoll;
        }



        catch (e) {
            this.logger.error(
                `Failed to add poll ${JSON.stringify(initialPoll)}\n${e}`,
            );
            throw new InternalServerErrorException();
        }
    }




    async joinpoll(pollId: string): Promise<Poll> {

        const key = `polls:${pollId}`;

        try {

            const currentPoll = await this.redisClient.call('JSON.GET', key, '.')

            return JSON.parse(currentPoll as string);


        } catch (e) {
            this.logger.error(`Failed to get pollID ${pollId}: ${e.message}`, e.stack);
            throw new InternalServerErrorException(`Failed to get pollID ${pollId}`);
        }
    }


    async addparticipent({
        pollID,
        userID,
        name,
    }: AddParticipantData): Promise<Poll> {
        const key = `polls:${pollID}`;
        const participentId = `pariticipentid.${userID}`
        try {
            const currentPoll = await this.redisClient.call('JSON.GET', key, participentId, JSON.stringify(name))
            return JSON.parse(currentPoll as string);
        } catch (e) {
            this.logger.error(`Failed to add participant to poll ${pollID}: ${e.message}`, e.stack)
            throw new InternalServerErrorException(`Failed to add participant to poll ${pollID}`)
        }
    }

    async removeParticipant(pollID: string, userID: string): Promise<Poll> {
        const key = `polls:${pollID}`;
        const participentId = `pariticipentid.${userID}`

        try {

            await this.redisClient.call('JSON.DEl', key, participentId);
            
      return this.joinpoll(pollID); 
        } catch (e) {
            this.logger.error(`Failed to remove participant ${userID} from poll ${pollID}: ${e.message}`, e.stack)
            throw new InternalServerErrorException(`Failed to remove participant from poll`)
        }
    }



}































