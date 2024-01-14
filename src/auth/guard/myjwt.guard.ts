import { AuthGuard } from '@nestjs/passport';
export class MyGuards extends AuthGuard('jwt') {}
