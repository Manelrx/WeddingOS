import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WeddingsModule } from './weddings/weddings.module';
import { VendorsModule } from './vendors/vendors.module';
import { ProposalsModule } from './proposals/proposals.module';
import { QueueModule } from './queue/queue.module';
import { WorkerModule } from './worker/worker.module';
import { PrismaModule } from './prisma/prisma.module';

const imports = [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    WeddingsModule,
    VendorsModule,
    ProposalsModule,
];

if (process.env.QUEUE_ENABLED === 'true') {
    imports.push(QueueModule);
}

if (process.env.WORKER_ENABLED === 'true') {
    imports.push(WorkerModule);
}

@Module({
    imports: imports,
    controllers: [],
    providers: [],
})
export class AppModule { }
