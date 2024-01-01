import { S3, S3ClientConfig, NoSuchKey } from '@aws-sdk/client-s3';

import {
  KeyStorageBackend,
  UserKeyStore,
} from '@sui-telegram-framework/storage';

/**
 * A key storage backend that uses S3 to store the keys. Keys are stored under
 * the keystore/ prefix.
 */
export class S3KeyStorageBackend implements KeyStorageBackend {
  private s3: S3;
  private bucketName: string;

  constructor(bucketName: string, s3Config?: S3ClientConfig) {
    this.s3 = new S3([s3Config]);
    this.bucketName = bucketName;
  }

  private getS3Key(tgId: number): string {
    return `keystore/${tgId}`;
  }

  async save(tgId: number, keystore: UserKeyStore): Promise<void> {
    const s3Key = this.getS3Key(tgId);
    const data = JSON.stringify(keystore);
    await this.s3.putObject({
      Bucket: this.bucketName,
      Key: s3Key,
      Body: data,
    });
  }

  async delete(tgId: number): Promise<void> {
    const s3Key = this.getS3Key(tgId);
    await this.s3.deleteObject({
      Bucket: this.bucketName,
      Key: s3Key,
    });
  }

  async retrieve(tgId: number): Promise<UserKeyStore | null> {
    const s3Key = this.getS3Key(tgId);
    try {
      const { Body } = await this.s3.getObject({
        Bucket: this.bucketName,
        Key: s3Key,
      });
      if (Body) {
        const data = await Body.transformToString();
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      if (error instanceof NoSuchKey) {
        return null;
      }
      throw error;
    }
  }
}
