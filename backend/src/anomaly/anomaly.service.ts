import { Injectable } from "@nestjs/common";


@Injectable()

export class AnomalyService {

    private processingTimes: number[] = [];
    private readonly windowSize = 10;
    private readonly anamolyStdMultiplier = Number(
        process.env.ANOMALY_STD_MULTIPLIER ?? 2
    );

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

        const threshold = mean + this.anamolyStdMultiplier * standardDeviation;
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