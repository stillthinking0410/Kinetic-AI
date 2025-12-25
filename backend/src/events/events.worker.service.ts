import { Injectable,OnModuleInit } from "@nestjs/common";
import { RedisService } from "../redis/redis.service";
import { EventsService } from "./events.service"

@Injectable()
export class EventsWorkerService implements OnModuleInit {
    constructor(
        private readonly redisService: RedisService,
        private readonly eventsService: EventsService,
    ) {}

    async onModuleInit() {
        console.log('Events worker started');

        const redis = this.redisService.getClient();

        try{
            await redis.xgroup(
                'CREATE',
                'events-stream',
                'events-group',
                '0',
                'MKSTREAM'
            );
            console.log('Consumer group created');
        } catch(err : any){
            if(err.message.includes('BUSYGROUP')){
                console.log('Consumer group already exists');
            } else {
                throw err;
            }
        }
        this.startWorker();
    }

    private async startWorker() {
        const redis = this.redisService.getClient();
        while(true){
            try{
                const response = await redis.xreadgroup(
                    'GROUP',
                    'events-group',
                    'worker-1',
                    'BLOCK' as any,
                    '5000',
                    'COUNT',
                    '10',
                    'STREAMS',
                    'events-stream',
                    '>',
                );

                if(!response) continue;

                for(const [, events] of response as any){
                    for(const [id, fields] of events){
                        const data = this.parseFields(fields as string[]);
                        console.log('Parsed event: ', id, data);
                        const normalizedEvent = {
                            sensorId: data.sensorId,
                            value: Number(data.value),
                            type: data.type,
                        };
                        await this.eventsService.createEvent(normalizedEvent);
                        await redis.xack('events-stream', 'events-group', id);
                    }
                }

            } catch(err){
                console.error('Worker error: ', err);
                await new Promise((res)=> setTimeout(res,1000));
            }
        }
    }

    private parseFields(fields: string[]): Record <string,string> {
        const result: Record<string,string> = {};

        for(let i=0;i<fields.length;i+=2){
            const key = fields[i];
            const value = fields[i+1];
            result[key] = value;
        }
        return result;
    }
}