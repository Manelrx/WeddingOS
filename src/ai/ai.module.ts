import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiService } from './ai.service';
import { GeminiProvider } from './providers/gemini.provider';
import { StorageModule } from '../storage/storage.module';

@Module({
    imports: [ConfigModule, StorageModule],
    providers: [
        AiService,
        GeminiProvider,
        // Future providers:
        // OpenAIProvider,
        // ClaudeProvider,
    ],
    exports: [AiService],
})
export class AiModule { }
