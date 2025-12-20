import { Module } from "@nestjs/common";
import {EventsService} from "./events.service";
import {EventsController} from "./events.controller";
import {PrismaModule} from "../prisma/prisma.module";
import {RedisModule} from "../redis/redis.module";

@Module({
    imports : [PrismaModule,RedisModule],
    providers : [EventsService],
    controllers : [EventsController],
})

export class EventsModule{}