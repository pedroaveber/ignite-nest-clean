import { Module } from '@nestjs/common'
import { R2Storage } from './r2-storage'
import { Uploader } from '@/domain/forum/application/storage/uploader'
import { EnvModule } from '../env/env.module'

@Module({
  providers: [{ useClass: R2Storage, provide: Uploader }],
  exports: [Uploader],
  imports: [EnvModule],
})
export class StorageModule {}
