import { Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from './redis.module';
import { JwtModule } from '@nestjs/jwt';

export const redis = RedisModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configServic: ConfigService) => {
    return {
      connectionOptions: {
        host: configServic.get('REDIS_HOST'),
        port: configServic.get('REDIS_PORT')
      },


      onClientReady: (client) => {
        Logger.log('Redis client ready');

        client.on('error', (err) => {
          Logger.error('Redis Client Error: ', err);
        });

        client.on('connect', () => {
          Logger.log(
            `Connected to redis on ${client.options.host}:${client.options.port}`,
          );
        });
      },
    }
  },

  inject: [ConfigService]
})





export const jwtModule = JwtModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_SECRET'),
    signOptions: {
      expiresIn: parseInt(configService.get<string>('POLL_DURATION', '3600'))
    },
  }),
  inject: [ConfigService],
});