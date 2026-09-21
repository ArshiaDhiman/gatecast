import { Component, ElementRef, input, output, viewChild } from "@angular/core";

@Component({
  selector: "app-dialog",
  template: `<dialog class="dialog" #dialog>
    <p class="dialog__message">{{ message() }}</p>

    <div class="dialog__actions">
      <button class="dialog__button" type="button" (click)="cancel()">
        Cancel
      </button>
      <button
        class="dialog__button dialog__button--danger"
        type="button"
        (click)="confirm()"
      >
        Revoke
      </button>
    </div>
  </dialog>`,
  styleUrl: "./dialog.scss",
})
export class Dialog {
  message = input("Are you sure?");
  confirmed = output<void>();

  private dialogRef = viewChild<ElementRef<HTMLDialogElement>>("dialog");

  open() {
    this.dialogRef()?.nativeElement.showModal();
  }

  confirm() {
    this.confirmed.emit();
    this.dialogRef()?.nativeElement.close();
  }

  cancel() {
    this.dialogRef()?.nativeElement.close();
  }
}
