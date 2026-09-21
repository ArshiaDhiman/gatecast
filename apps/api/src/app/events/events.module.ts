import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Event } from "./event.model";
import { Invite } from "./invite.model";
import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";

@Module({
  imports: [SequelizeModule.forFeature([Event, Invite])],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
