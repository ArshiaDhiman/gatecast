import { Component, computed, inject, signal, viewChild } from "@angular/core";
import { EventsService } from "./events.service";
import { EventDto } from "@gatecast/shared";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { DatePipe } from "@angular/common";
import { Dialog } from "./dialog";

export type ModalType = "revoke" | "create";

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
  modalType = signal<ModalType>("revoke");

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

  dialogConfig = computed(() =>
    this.modalType() === "revoke"
      ? {
          message:
            "Revoke this invite? The link will stop working immediately.",
          confirmLabel: "Revoke",
        }
      : {
          message: "Create a new invite link for this event?",
          confirmLabel: "Create",
        },
  );

  openModal(type: ModalType, token?: string) {
    this.modalType.set(type);
    this.pendingToken.set(token ?? null);
    this.dialog()?.open();
  }

  onConfirm() {
    if (this.modalType() === "revoke") this.revokeInvite();
    else this.createInvite();
  }

  createInvite() {
    this.message.set("");

    this.eventsService.createInvite(Number(this.id)).subscribe({
      next: () => {
        this.message.set("Invite created");
        this.load(this.id);
      },
      error: () => this.message.set("There was an issue creating the invite"),
    });
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
