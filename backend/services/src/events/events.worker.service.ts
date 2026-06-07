import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RedisService } from "../redis/redis.service";
import { EventsService } from "./events.service";
import { AnomalyService } from "src/anomaly/anomaly.service";
import { AlertsService } from "src/alerts/alerts.service";

@Injectable()
export class EventsWorkerService implements OnModuleInit {

    private readonly eventStreamName: string;
    private readonly eventGroupName: string;
    private readonly workerId: string;
    private readonly workerBatchSize: number;
    private readonly workerBlockTimeout: number;
    private readonly enableAnomalySimulation: boolean;
    private readonly simulatedSpikeDelay: number;
    private readonly simulatedNormalDelay: number;

    constructor(
        private readonly redisService: RedisService,
        private readonly eventsService: EventsService,
        private readonly anomalyService: AnomalyService,
        private readonly alertsService: AlertsService,
        private readonly configService: ConfigService,
    ) {

        this.eventStreamName =
            this.configService.get<string>('EVENT_STREAM_NAME')!;

        this.eventGroupName =
            this.configService.get<string>('EVENT_GROUP_NAME')!;

        this.workerId =
            this.configService.get<string>('WORKER_ID')!;

        this.workerBatchSize = Number(
            this.configService.get<string>('WORKER_BATCH_SIZE')
        );

        this.workerBlockTimeout = Number(
            this.configService.get<string>('WORKER_BLOCK_TIMEOUT')
        );

        this.enableAnomalySimulation = 
            this.configService.get<string>('ENABLE_ANOMALY_SIMULATION') === 'true';

        this.simulatedNormalDelay = Number(
            this.configService.get<string>('SIMULATED_NORMAL_DELAY')
        );

        this.simulatedSpikeDelay = Number(
            this.configService.get<string>('SIMULATED_SPIKE_DELAY')
        );
    }

    async onModuleInit() {
        console.log('Events worker started');

        const redis = this.redisService.getClient();

        try{
            await redis.xgroup(
                'CREATE',
                this.eventStreamName,
                this.eventGroupName,
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
                    this.eventGroupName,
                    this.workerId,
                    'BLOCK' as any,
                    this.workerBlockTimeout,
                    'COUNT',
                    this.workerBatchSize,
                    'STREAMS',
                    this.eventStreamName,
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
                        const startTime = Date.now();

                        if (this.enableAnomalySimulation){
                            if(Math.random() < 0.2){
                                await new Promise((res) =>
                                    setTimeout(res, this.simulatedSpikeDelay)
                                );
                            }
                            else{
                                await new Promise((res) =>
                                    setTimeout(res, this.simulatedNormalDelay)
                                );
                            }
                        }

                        await this.eventsService.createEvent(normalizedEvent);
                        const endTime = Date.now();
    
                        const processingTime = endTime - startTime;

                        const anomaly =
                            this.anomalyService.detectAnomaly(processingTime);

                        if (anomaly) {
                            console.log(
                                'Anomaly Detected:',
                                anomaly
                            );
                            this.alertsService.createAlert(anomaly);
                        }

                        await redis.xack(
                            this.eventStreamName,
                            this.eventGroupName,
                            id
                        );
                    }
                }

            } catch (err) {
                console.error('Worker error:', err);
                await new Promise((res) =>
                    setTimeout(res, 1000)
                );
            }
        }
    }

    private parseFields(
        fields: string[]
    ): Record<string, string> {
        const result: Record<string, string> = {};

        for(let i=0;i<fields.length;i+=2){
            const key = fields[i];
            const value = fields[i+1];
            result[key] = value;
        }
        return result;
    }

}