import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root(): string {
    return 'Kinetic AI Backend';
  }

  @Get('health')
  health(){
    return {status:'ok',time: new Date().toISOString()};
  }
}
