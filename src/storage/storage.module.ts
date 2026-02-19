import { Module } from '@nestjs/common';
import { LocalStorageProvider } from './providers/local-storage.provider';
import { S3StorageProvider } from './providers/s3-storage.provider';

@Module({
    providers: [
        LocalStorageProvider,
        S3StorageProvider,
        {
            provide: 'IStorageProvider',
            useClass: LocalStorageProvider, // Defaulting to Local
        },
    ],
    exports: ['IStorageProvider'],
})
export class StorageModule { }
