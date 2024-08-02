import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'
import { JwtStrategy } from './jwt.strategy'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './jwt-auth.guard'
import { EnvService } from '../env.service'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      extraProviders: [EnvService],
      global: true,
      inject: [EnvService],
      useFactory(env: EnvService) {
        const privateKeyBase64 = env.get('JWT_PRIVATE_KEY')
        const publicKeyBase64 = env.get('JWT_PUBLIC_KEY')
        const privateKeyPassword = env.get('JWT_PRIVATE_KEY_PASSWORD')

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
    EnvService,
  ],
})
export class AuthModule {}
