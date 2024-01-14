import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from './../prisma/prisma.service';
import { MailService } from './../mail/mail.service';
import { AuthService } from '../auth/auth.service';
import { ChatGateway } from './chat.gateway';
import { Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtStrategy, RtJwtStrategy } from '../auth/strategies';
import { ConfigService } from '@nestjs/config';
import { AuthUserDto } from '../auth/dto';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

@Module({
  imports: [JwtModule.register({})],
  providers: [
    ChatGateway,
    AuthService,
    UserService,
    JwtStrategy,
    ConfigService,
    RtJwtStrategy,
    MailService,
    AuthUserDto,
    PrismaService,
    JwtService,
    ChatService,
  ],
  controllers: [ChatController],
})
export class ChatModule {}
