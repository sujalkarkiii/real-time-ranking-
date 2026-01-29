import { BadGatewayException, BadRequestException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";
import { IORedisKey } from "src/redis.module";
import { AddParticipantData, AddParticipantRankingsData, CreatePollData } from "./types";
import { Poll } from "shared/polls-types";
import { polls } from "./Entity/polls.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatePollDto } from "./dto/create-polls.dto";
import { createnominee } from "./dto/add-nominee.dto";

@Injectable()
export class pollsRepository {
    private readonly ttl: string;
    private readonly logger = new Logger(pollsRepository.name);

    constructor(
        configservice: ConfigService,
        @Inject(IORedisKey) private readonly redisClient: Redis,
        @InjectRepository(polls) private pollsrepo: Repository<polls>
    ) {
        this.ttl = configservice.get('POLL_DURATION', '3600');
    }


    async createPOll({ votesPerVoter, topic, pollID, userID }: CreatePollData): Promise<Poll> {
        const initialPoll = {
            id: pollID,
            topic,
            votesPerVoter,
            participants: {},               // {userid:"" , username:""}  
            nominations: [],              //    x,y,z to tick what to vote
            rankings: {},                 //x= 6, y=2  votes aayo bhan na
            results: [],
            adminID: userID,
            hasStarted: false,
        };


        const key = `polls:${pollID}`;

        try {
            await this.redisClient
                .multi()
                .set(key, JSON.stringify(initialPoll))
                .expire(key, this.ttl)
                .exec();
            return initialPoll;
        }



        catch (e) {
            this.logger.error(
                `Failed to add poll ${JSON.stringify(initialPoll)}${e}`,
            );
            throw new InternalServerErrorException();
        }
    }



    // ===getpoll
    async joinpoll(pollId: string): Promise<Poll> {

        const key = `polls:${pollId}`;

        try {

            const currentPollString = await this.redisClient.get(key)
            if (!currentPollString) {
                this.logger.error('Redis key not found:', key);
            }

            return JSON.parse(currentPollString as string);


        } catch (e) {
            this.logger.error(`Failed to get pollID ${pollId}: ${e.message}`, e.stack);
            throw new InternalServerErrorException(`Failed to get pollID ${pollId}`);
        }
    }


    // here logic of voters comes under this seciton
    async addParticipantRankings({
        pollID,
        userID,
        nomination,
        name
    }: AddParticipantRankingsData): Promise<Poll> {
        this.logger.log(
            `Attempting to add rankings for userID: ${userID} to pollID: ${pollID}`,
            nomination,
        );

        const key = `polls:${pollID}`;

        try {

            const currentPollString = await this.redisClient.get(key);

            if (!currentPollString) {
                throw new NotFoundException(`Poll with ID ${pollID} not found`);
            }
            const poll: Poll = JSON.parse(currentPollString as string);

            if (poll.hasStarted == false) {
                throw new BadRequestException('Participants cannot rank until the poll has started')
            }


            if (poll.participants[userID]) {
                throw new BadRequestException(`User ${userID} has already joined the poll`);
            } else {
                poll.participants[userID] = name;
            }
            poll.nominations.push(nomination)

            await this.redisClient.set(key, JSON.stringify(poll));

            return poll;
        } catch (e) {
            this.logger.error(
                `Failed to add rankings for userID: ${userID} in pollID: ${pollID}`,
                e.stack,
            );
            throw new InternalServerErrorException(
                'There was an error saving participant rankings',
            );
        }
    }














    // Function comminng under admin section started
    async addparticipent({
        pollID,
        userID,
        name,
    }: AddParticipantData): Promise<Poll> {
        const key = `polls:${pollID}`;
        const participentId = `pariticipentid.${userID}`
        try {
            const currentPoll = await this.redisClient.get(key)
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




    async starpoll(pollID: string): Promise<Poll> {

        const key = `polls:${pollID}`;

        try {
            const pollString = await this.redisClient.get(key);

            if (!pollString) {
                throw new Error('Poll not found');
            }


            const poll: Poll = JSON.parse(pollString);
            poll.hasStarted = true
            await this.redisClient.set(key, JSON.stringify(poll));

            return poll;




        } catch (e) {
            this.logger.error(`Failed to start poll ${pollID}: ${e.message}`, e.stack);
            throw new InternalServerErrorException(`Failed to start poll ${pollID}`);
        }
    }









    //function under admin server ended












    async getresult(pollID: string): Promise<Poll> {

        const key = `polls:${pollID}`;
        try {

            const total_vote = await this.redisClient.get(key)
            if (!total_vote) {
                throw new NotFoundException(`Poll ${pollID} not found`);
            }
            const poll: Poll = JSON.parse(total_vote as string);
            poll.nominations.forEach(ele => {
                poll.rankings[ele] = (poll.rankings[ele] || 0) + 1;
            });


            await this.redisClient.del(key)
            return poll




        } catch (e) {
            this.logger.error(`Failed to get result for poll ${pollID}`, e.stack);
            throw new InternalServerErrorException(`Error getting poll result`);
        }
    }


    async addnomines(check: createnominee) {

        try {
            const { pollId, name } = check
            const poll = this.pollsrepo.create({ pollId: pollId, nominees: [name] })
            const savedPoll = this.pollsrepo.save(poll)
            await this.redisClient.set(`poll:${pollId}123`, JSON.stringify(savedPoll));

        } catch (error) {
            this.logger.error('failed to input to the database')
            throw new BadGatewayException('Error on database conneciton')
        }
    }

    async sendnominee(pollID: string) {
        const redisKey = `poll:${pollID}123`
        const raw = await this.redisClient.get(redisKey)
        if (!raw) {
            return { nominees: [] };
        }

        const poll = JSON.parse(raw);

        return { nominees: poll.nominees || [] };
    } catch(error) {
        this.logger.error('Failed to fetch nominees from Redis', error);
        throw new BadGatewayException('Error fetching poll data');
    }






}








































