import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()

export class AnomalyService {
    constructor(private configService: ConfigService) {
        this.windowSize = Number(this.configService.get('WINDOW_SIZE'));
        this.anomalyStdMultiplier = Number(this.configService.get('ANOMALY_STD_MULTIPLIER'));
    }

    private processingTimes: number[] = [];
    private readonly windowSize: number;
    private readonly anomalyStdMultiplier: number;

    public detectAnomaly(processingTime: number) {
        this.processingTimes.push(processingTime);

        if (this.processingTimes.length > this.windowSize) {
            this.processingTimes.shift();
        }

        if (this.processingTimes.length < this.windowSize) {
            this.processingTimes.push(processingTime);
            return null;
        }

        const sum = this.processingTimes.reduce(
            (total, value) => total + value,
            0
        );

        const mean = sum / this.processingTimes.length;

        const variance = this.processingTimes.reduce(
            (total, value) => {
                const diff = value - mean;
                return total + (diff * diff);
            }, 0) / this.processingTimes.length;

        const standardDeviation = Math.sqrt(variance);

        const threshold = mean + this.anomalyStdMultiplier * standardDeviation;
        console.log({
            processingTime,
            mean,
            standardDeviation,
            threshold
        });

        if (processingTime > threshold) {
            return {
                processingTime,
                mean,
                standardDeviation,
                threshold,
                timestamp: new Date(),
                severity:
                    processingTime > mean + 3 * standardDeviation ? 'HIGH' : 'MEDIUM',
            };
        }

        this.processingTimes.push(processingTime);

        if (this.processingTimes.length > this.windowSize) {
            this.processingTimes.shift();
        }

        return null;
    }
}