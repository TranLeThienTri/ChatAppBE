import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prismaService: PrismaService) {}

  async createMessage(sendId: number, receiverId: number, content: string) {
    const message = await this.prismaService.message.create({
      data: {
        sendUserId: sendId,
        receiverUserId: receiverId,
        content,
      },
    });
    return message;
  }

  async getMessagesBetweenUsers(userId1: number, userId2: number) {
    const messages = await this.prismaService.message.findMany({
      where: {
        OR: [
          { sendUserId: userId1, receiverUserId: userId2 },
          { sendUserId: userId2, receiverUserId: userId1 },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });
    return messages;
    // return {
    //   idSend: messages['sendUserId'],
    //   idRep: messages['receiverUserId'],
    //   msg: messages['content'],
    // };
  }
}
