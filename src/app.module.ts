/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ArticleModule } from './article/article.module';
import { ChatModule } from './chat/chat.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
    ArticleModule,
    ChatModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client'),
      exclude: ['server/*'],
    }),
  ],
})
export class AppModule {}
