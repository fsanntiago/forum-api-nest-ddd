import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Env } from '@/infra/env'
import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'
import { JwtStrategy } from './jwt.strategy'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './jwt-auth.guard'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory(config: ConfigService<Env, true>) {
        const privateKeyBase64 = config.get('JWT_PRIVATE_KEY', { infer: true })
        const publicKeyBase64 = config.get('JWT_PUBLIC_KEY', { infer: true })
        const privateKeyPassword = config.get<string>(
          'JWT_PRIVATE_KEY_PASSWORD',
          { infer: true },
        )

        const privateKey = Buffer.from(privateKeyBase64, 'base64').toString(
          'utf8',
        )
        const publicKey = Buffer.from(publicKeyBase64, 'base64').toString(
          'utf8',
        )

        // Create a temporary file to store the private key
        const privateKeyPath = path.join(__dirname, 'private_key.pem')
        fs.writeFileSync(privateKeyPath, privateKey)

        // Decrypt the private key
        const decryptedPrivateKey = crypto
          .createPrivateKey({
            key: fs.readFileSync(privateKeyPath),
            format: 'pem',
            passphrase: privateKeyPassword,
          })
          .export({ format: 'pem', type: 'pkcs1' })
          .toString('utf8')

        // Clean up the temporary file
        fs.unlinkSync(privateKeyPath)

        return {
          signOptions: { algorithm: 'RS256' },
          privateKey: decryptedPrivateKey,
          publicKey,
        }
      },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtStrategy,
  ],
})
export class AuthModule {}
