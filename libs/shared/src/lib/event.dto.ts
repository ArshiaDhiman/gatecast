export interface EventDto {
  id: number;
  title: string;
  streamUrl: string;
  startsAt: string;
  invites?: Invite[];
}

export interface CreateEventRequest {
  title: string;
  streamUrl: string;
  startsAt: string;
}

export interface CreateEventResponse {
  event: EventDto;
  inviteToken: string;
}

export interface Invite {
  id: number;
  token: string;
  eventId: number;
  createdAt: string;
  updatedAt: string;
}
