import { Module } from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { ProposalsController } from './proposals.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { QueueModule } from '../queue/queue.module';

@Module({
    imports: [
        PrismaModule,
        MulterModule.registerAsync({
            useFactory: () => {
                const storagePath = path.join(process.cwd(), process.env.STORAGE_PATH || 'storage', 'proposals');

                // Ensure storage directory exists
                if (!fs.existsSync(storagePath)) {
                    fs.mkdirSync(storagePath, { recursive: true });
                }

                return {
                    storage: diskStorage({
                        destination: (req, file, cb) => {
                            cb(null, storagePath);
                        },
                        filename: (req, file, cb) => {
                            const filename = `${uuidv4()}.pdf`;
                            cb(null, filename);
                        },
                    }),
                    limits: {
                        fileSize: 10 * 1024 * 1024, // 10MB
                    },
                    fileFilter: (req, file, cb) => {
                        if (file.mimetype === 'application/pdf') {
                            cb(null, true);
                        } else {
                            cb(new Error('Only PDF files are allowed!'), false);
                        }
                    },
                };
            },
        }),
        QueueModule,
    ],
    controllers: [ProposalsController],
    providers: [ProposalsService],
})
export class ProposalsModule { }
