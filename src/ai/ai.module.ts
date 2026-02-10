
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiService } from './ai.service';
import { GeminiProvider } from './providers/gemini.provider';

@Module({
    imports: [ConfigModule],
    providers: [AiService, GeminiProvider],
    exports: [AiService],
})
export class AiModule { }
