import { JwtAuthGuard } from './shared/jwt-auth.guard';
import { Module } from '@nestjs/common';
import { AuthService } from './shared/auth.service';
import { LocalStrategy } from './shared/local.strategy';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './shared/jwt.strategy';
import { RolesGuard } from './shared/roles.guard';


@Module({
    imports: [
        UserModule,
        PassportModule,
        ConfigModule.forRoot({
            envFilePath: '.env',
        }),
        JwtModule.register({
          secret: process.env.JWTSECRETKEY,
          signOptions: { expiresIn: '1500s' },
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        JwtAuthGuard,
        RolesGuard
    ]
})
export class AuthModule {}
