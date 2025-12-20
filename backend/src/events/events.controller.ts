import {Body, Controller, Get, Post, Query} from '@nestjs/common';
import { EventsService } from './events.service';
import { RedisService } from '../redis/redis.service';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('events')
export class EventsController {
    constructor(
        private readonly eventsService: EventsService,
        private readonly redisService: RedisService,
    ) {}

    @Post()
    async createEvent(@Body() createEventDto: CreateEventDto){
        const redis = this.redisService.getClient();

        //Publish event to Redis Channel
        await redis.xadd(
            'events-stream',
            '*',
            'sensorId', createEventDto.sensorId,
            'value', createEventDto.value.toString(),
            'type', createEventDto.type ?? '',
            'timestamp', new Date().toISOString(),
        );

        return { status: 'accepted'};
    }

    @Get()
    async findRecent(@Query('limit') limit?: string){
        const n = limit ? parseInt(limit,10) : 50;
        return this.eventsService.findRecent(n);
    }
}