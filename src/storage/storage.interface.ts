export interface IStorageProvider {
    getFileBuffer(path: string): Promise<Buffer>;
}
