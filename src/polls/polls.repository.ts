import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";
import { IORedisKey } from "src/redis.module";

@Injectable()
export class pollsRepository {
    constructor(
        configservice:ConfigService,
        @Inject(IORedisKey) private readonly redisClient:Redis
    ){}



    
}