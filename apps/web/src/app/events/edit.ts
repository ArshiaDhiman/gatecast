import { Component, inject, signal } from "@angular/core";
import { EventsService } from "./events.service";
import { EventDto } from "@gatecast/shared";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-edit",
  imports: [],
  templateUrl: "./edit.html",
})
export class Edit {
  private eventsService = inject(EventsService);
  private route = inject(ActivatedRoute);

  event = signal<EventDto | null>(null);
  denied = signal(false);

  constructor() {
    const id = this.route.snapshot.paramMap.get("id") || "";

    this.load(id);
  }

  load(id: string) {
    this.eventsService.findEventById(Number(id)).subscribe({
      next: (event) => {
        console.log("event", event);
        this.event.set(event);
      },
      error: () => this.denied.set(true),
    });
  }
}
