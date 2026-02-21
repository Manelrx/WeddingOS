import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

@Module({
    imports: [
        BullModule.forRoot({
            connection: {
                host: process.env.REDIS_HOST || 'localhost',
                port: Number(process.env.REDIS_PORT) || 6379,
            },
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000,
                },
                removeOnComplete: true,
            },
        }),
        BullModule.registerQueue({
            name: 'proposal-processing',
        }),
    ],
    exports: [BullModule],
})
export class QueueModule {
    constructor() {
        console.log('QueueModule INITIALIZED!');
    }
}
