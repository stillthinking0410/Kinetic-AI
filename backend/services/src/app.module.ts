import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';

@Module({
  imports: [EventsModule,
    ConfigModule.forRoot({
      isGlobal: true
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
