import { Component, inject, signal } from "@angular/core";
import { ReactiveFormsModule, FormGroup, FormControl } from "@angular/forms";
import { EventsService } from "./events.service";
import { EventDto } from "@gatecast/shared";
import { DatePipe } from "@angular/common";
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: "app-organiser",
  imports: [ReactiveFormsModule, DatePipe, RouterLink],
  templateUrl: "./organiser.html",
  styleUrl: "./organiser.scss",
})
export class Organiser {
  private eventsService = inject(EventsService);
  private router = inject(Router);

  events = signal<EventDto[]>([]);
  inviteToken = signal<string | null>(null);

  form = new FormGroup({
    title: new FormControl("", { nonNullable: true }),
    streamUrl: new FormControl("", { nonNullable: true }),
    startsAt: new FormControl("", { nonNullable: true }),
  });

  constructor() {
    this.load();
  }

  load() {
    this.eventsService.findAll().subscribe((events) => this.events.set(events));
  }

  submit() {
    this.eventsService.create(this.form.getRawValue()).subscribe((res) => {
      this.inviteToken.set(res.inviteToken);
      this.form.reset();
      this.load();
    });
  }

  onEventClick(id: number) {
    this.router.navigate(["/events", id]);
  }
}
