import { Injectable } from '@nestjs/common'

import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'

import { compare, hash } from 'bcryptjs'

@Injectable()
export class BcryptHasher implements HashComparer, HashGenerator {
  private readonly round = 8

  async compare(plain: string, hash: string): Promise<boolean> {
    return await compare(plain, hash)
  }

  async hash(plain: string): Promise<string> {
    return hash(plain, this.round)
  }
}
