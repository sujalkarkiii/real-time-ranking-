import { DynamicModule, FactoryProvider, ModuleMetadata } from '@nestjs/common';
import { Module } from '@nestjs/common';
import IORedis, { Redis, RedisOptions } from 'ioredis';

export const IORedisKey = 'IORedis';


// type RedisModuleOptions and type RedisAsyncModuleOptions this are just frames/blueprint that can be used to define 
type RedisModuleOptions = {
  connectionOptions: RedisOptions;
  onClientReady?: (client: Redis) => void;
};

type RedisAsyncModuleOptions = {
  useFactory: (
    ...args: any[]    //...args:any[]  accepts anynumber of argument as an array of any type
  ) => Promise<RedisModuleOptions> | RedisModuleOptions;
} & Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider, 'inject'>;





@Module({})
export class RedisModule {
  static async registerAsync({
    useFactory,
    imports,
    inject,
  }: RedisAsyncModuleOptions): Promise<DynamicModule> {
    
    
    
    const redisProvider = {
      provide: IORedisKey,
      useFactory: async (...args) => {
        const { connectionOptions, onClientReady } = await useFactory(...args);

        const client = await new IORedis(connectionOptions);
        onClientReady(client);

        return client;
      },
      inject,
    };



    return {
      module: RedisModule,
      imports,
      providers: [redisProvider],
      exports: [redisProvider],
    };
  }
}

/*

allows users to configure Redis asynchronously (e.g., using config service
 or env variables) and inject the Redis client anywhere in the app.


@Module({})
export class RedisModule {
  static async registerAsync(options: RedisAsyncModuleOptions): Promise<DynamicModule> { ... }
}
here options include 
   ->> useFactory,
   ->> imports,
   ->> inject,
 */
