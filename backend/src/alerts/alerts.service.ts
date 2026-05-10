import { Injectable } from "@nestjs/common";
import { EventEmitter }  from "events";

@Injectable()

export class AlertsService {
    private emitter = new EventEmitter();

    
    public createAlert(anomaly: any) {
        const alert = {
            type: 'LATENCY_ANOMALY',
            processingTime: anomaly.processingTime,
            mean: anomaly.mean,
            threshold: anomaly.threshold,
            severity: anomaly.severity,
            timestamp: anomaly.timestamp,
        };

        this.emitter.emit('alert',alert);
    }

    public onAlert(listener: (alert: any) => void){
        this.emitter.on('alert', listener);
    }
}
