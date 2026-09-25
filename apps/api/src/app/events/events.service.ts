import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { randomBytes } from "node:crypto";
import { Event } from "./event.model";
import { Invite } from "./invite.model";
import { CreateEventDto } from "./create-event.dto";

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event) private eventModel: typeof Event,
    @InjectModel(Invite) private inviteModel: typeof Invite,
  ) {}

  findAll() {
    return this.eventModel.findAll({ order: [["startsAt", "ASC"]] });
  }

  async create(dto: CreateEventDto) {
    // these two writes should be atomic and I'd wrap them in a transaction
    const event = await this.eventModel.create({
      title: dto.title,
      streamUrl: dto.streamUrl,
      startsAt: new Date(dto.startsAt),
    });

    const invite = await this.createInvite(event.id);

    return { event, inviteToken: invite.token };
  }

  async createInvite(eventId: number) {
    // use findbypk
    const event = await this.eventModel.findOne({ where: { id: eventId } });

    if (!event) throw new NotFoundException("Event not found");

    const invite = await this.inviteModel.create({
      // has to be cryptographically unpredictable
      token: randomBytes(16).toString("hex"),
      eventId,
    });

    return invite;
  }

  async deleteInvite(token: string) {
    const count = await this.inviteModel.destroy({ where: { token } });

    if (count === 0) throw new NotFoundException("Invite not found");
  }

  async findEventById(id: number) {
    const event = await this.findByEventId(id);
    if (!event) throw new NotFoundException("Event not found");
    return event;
  }

  findByEventId(id: number) {
    return this.eventModel.findOne({
      where: { id },
      include: [Invite],
    });
  }

  findByToken(token: string) {
    return this.inviteModel.findOne({
      where: { token },
      include: [Event],
    });
  }

  async findEventByToken(token: string) {
    const invite = await this.findByToken(token);
    if (!invite) throw new NotFoundException("Invite not found");
    return invite.event;
  }
}
