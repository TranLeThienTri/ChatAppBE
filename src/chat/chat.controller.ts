import { GetUser } from '../auth/decorator';
import { ChatService } from './chat.service';
import { Controller, Get } from '@nestjs/common';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  @Get()
  async getAllMessages(@GetUser('id') id1: number, @GetUser('id') id2: number) {
    return await this.chatService.getMessagesBetweenUsers(id1, id2);
  }
}
