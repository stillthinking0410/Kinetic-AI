import { Module } from "@nestjs/common";
import {EventsService} from "./events.service";
import {EventsController} from "./events.controller";
import {PrismaModule} from "../prisma/prisma.module";
import {RedisModule} from "../redis/redis.module";
import { EventsWorkerService } from "./events.worker.service";

@Module({
    imports : [PrismaModule,RedisModule],
    providers : [EventsService,EventsWorkerService],
    controllers : [EventsController],
})

export class EventsModule{}