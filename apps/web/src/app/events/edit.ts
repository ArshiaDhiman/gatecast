import { Component, inject, signal, viewChild } from "@angular/core";
import { EventsService } from "./events.service";
import { EventDto } from "@gatecast/shared";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { DatePipe } from "@angular/common";
import { Dialog } from "./dialog";

@Component({
  selector: "app-edit",
  imports: [DatePipe, RouterLink, Dialog],
  templateUrl: "./edit.html",
  styleUrl: "./edit.scss",
})
export class Edit {
  private eventsService = inject(EventsService);
  private route = inject(ActivatedRoute);

  event = signal<EventDto | null>(null);
  denied = signal(false);
  message = signal<string>("");
  pendingToken = signal<string | null>(null);

  private id = this.route.snapshot.paramMap.get("id") || "";
  private dialog = viewChild(Dialog);

  constructor() {
    this.load(this.id);
  }

  load(id: string) {
    this.eventsService.findEventById(Number(id)).subscribe({
      next: (event) => {
        this.event.set(event);
      },
      error: () => this.denied.set(true),
    });
  }

  openModal(token: string) {
    this.pendingToken.set(token);
    this.dialog()?.open();
  }

  revokeInvite() {
    const token = this.pendingToken();

    if (!token) return;

    this.message.set("");
    this.eventsService.revokeInvite(token).subscribe({
      next: () => {
        this.message.set("Successfully revoked the invite");
        this.load(this.id);
      },
      error: () => this.message.set("There was a issue revoking the invite"),
    });
  }
}
