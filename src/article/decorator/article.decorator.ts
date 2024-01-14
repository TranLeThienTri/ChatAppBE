/* eslint-disable prettier/prettier */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetArticle = createParamDecorator(
  (key: string, context: ExecutionContext) => {
    const request: Express.Request = context.switchToHttp().getRequest();
    const article = request;
    return key ? article?.[key] : article;
  },
);
