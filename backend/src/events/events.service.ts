import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateEventDto } from "./dto/create-event.dto";

@Injectable()
export class EventsService {
    constructor(private prisma: PrismaService){}

    async createEvent(createEventDto: CreateEventDto){
        const event = await this.prisma.event.create({
            data: {
                sensorId: createEventDto.sensorId,
                value: createEventDto.value,
                type: createEventDto.type ?? null,       
            },
        });
        return event;
    }

    async findRecent(limit=50){
        return this.prisma.event.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
}