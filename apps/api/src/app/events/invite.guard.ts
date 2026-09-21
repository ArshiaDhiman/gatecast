import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { EventsService } from "./events.service";

@Injectable()
export class InviteGuard implements CanActivate {
  constructor(private eventsService: EventsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.params.token;

    const invite = await this.eventsService.findByToken(token);
    if (!invite) {
      throw new ForbiddenException("Not invited");
    }

    request.invite = invite;
    return true;
  }
}

// 401 - i don't know who you are
// 403 - I know and your not allowed
