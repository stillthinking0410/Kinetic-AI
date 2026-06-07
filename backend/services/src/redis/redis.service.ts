import { Injectable,OnModuleInit } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleInit {
    private redis: Redis;

    async onModuleInit() {
        this.redis = new Redis();
    }

    getClient(): Redis {
        return this.redis;
    }
}