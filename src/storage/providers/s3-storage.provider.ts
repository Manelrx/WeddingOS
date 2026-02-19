import { Injectable, Logger } from '@nestjs/common';
import { IStorageProvider } from '../storage.interface';

@Injectable()
export class S3StorageProvider implements IStorageProvider {
    private readonly logger = new Logger(S3StorageProvider.name);

    async getFileBuffer(path: string): Promise<Buffer> {
        this.logger.log(`[MOCK S3] Downloading file from S3: ${path}`);
        // In a real scenario, this would use @aws-sdk/client-s3
        throw new Error('S3StorageProvider not fully implemented. Using mock for now.');
    }
}
