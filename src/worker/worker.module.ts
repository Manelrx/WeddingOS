import { Module } from '@nestjs/common';
import { ProposalProcessor } from './proposal.processor';
import { QueueModule } from '../queue/queue.module';
import { AiModule } from '../ai/ai.module';

@Module({
    imports: [QueueModule, AiModule],
    providers: [ProposalProcessor],
})
export class WorkerModule { }

