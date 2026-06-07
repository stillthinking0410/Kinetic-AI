import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AlertsService } from './alerts.service';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})

export class AlertsGateway implements OnModuleInit {
    @WebSocketServer()
    server!: Server;

    constructor(
        private readonly alertsService: AlertsService,
    ) {}

    onModuleInit() {
        this.alertsService.onAlert((alert) => {
            this.server.emit('alert',alert);
        });
    }
}