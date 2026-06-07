import { Module } from "@nestjs/common";
import { AlertsService } from "./alerts.service";
import { AlertsGateway } from "./alerts.gateway";

@Module({
    providers:[AlertsService, AlertsGateway],
    exports:[AlertsService]
})

export class AlertsModule{} 