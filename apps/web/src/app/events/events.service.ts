import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

import {
  EventDto,
  CreateEventResponse,
  CreateEventRequest,
} from "@gatecast/shared";

@Injectable({ providedIn: "root" })
export class EventsService {
  private http = inject(HttpClient);

  findAll() {
    return this.http.get<EventDto[]>("/api/events");
  }

  create(body: CreateEventRequest) {
    return this.http.post<CreateEventResponse>("/api/events", body);
  }

  findByToken(token: string) {
    return this.http.get<EventDto>(`/api/watch/${token}`);
  }

  findEventById(id: number) {
    return this.http.get<EventDto>(`/api/events/${id}`);
  }

  revokeInvite(token: string) {
    return this.http.delete(`/api/invites/${token}`);
  }
}
