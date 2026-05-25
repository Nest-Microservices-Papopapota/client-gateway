import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class HealthCheckController {
    @Get()
    checkHealth(): string {
        return 'Client gateway is healthy';
    }
}
