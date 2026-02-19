import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import { IStorageProvider } from '../storage.interface';

@Injectable()
export class LocalStorageProvider implements IStorageProvider {
    async getFileBuffer(path: string): Promise<Buffer> {
        return await fs.readFile(path);
    }
}
