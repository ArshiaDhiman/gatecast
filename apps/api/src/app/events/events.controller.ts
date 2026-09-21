import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import { EventsService } from "./events.service";
import { CreateEventDto } from "./create-event.dto";
import { InviteGuard } from "./invite.guard";

@Controller()
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get("events")
  findAll() {
    return this.eventsService.findAll();
  }

  @Post("events")
  create(@Body() dto: CreateEventDto) {
    return this.eventsService.create(dto);
  }

  @Get("events/:id")
  getEvent(@Param("id", ParseIntPipe) id: number) {
    return this.eventsService.findEventById(id);
  }

  @Get("watch/:token")
  @UseGuards(InviteGuard)
  watch(@Param("token") token: string) {
    return this.eventsService.findEventByToken(token);
  }

  @Post("events/:id/invites")
  createInvite(@Param("id", ParseIntPipe) id: number) {
    return this.eventsService.createInvite(id);
  }

  @Delete("invites/:token")
  deleteInvite(@Param("token") token: string) {
    return this.eventsService.deleteInvite(token);
  }
}
