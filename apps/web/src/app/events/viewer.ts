import {
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  viewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { EventsService } from "./events.service";
import { EventDto } from "@gatecast/shared";
import Hls from "hls.js";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-viewer",
  imports: [DatePipe],
  templateUrl: "./viewer.html",
  styleUrl: "./viewer.scss",
})
export class Viewer implements OnDestroy {
  // knows about current route
  private route = inject(ActivatedRoute);
  private eventsService = inject(EventsService);

  event = signal<EventDto | null>(null);
  denied = signal(false);

  // grab the child element
  videoRef = viewChild<ElementRef<HTMLVideoElement>>("video");
  private hls?: Hls;

  constructor() {
    const token = this.route.snapshot.paramMap.get("token") || "";

    this.eventsService.findByToken(token).subscribe({
      next: (event) => this.event.set(event),
      error: () => this.denied.set(true),
    });

    effect(() => {
      const event = this.event();
      const video = this.videoRef()?.nativeElement;

      if (!event || !video) return;
      this.play(event.streamUrl, video);
    });
  }

  private play(url: string, video: HTMLVideoElement) {
    this.hls?.destroy();
    if (Hls.isSupported()) {
      this.hls = new Hls();
      this.hls.loadSource(url);
      this.hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
    } else {
      // surface error
    }
  }

  ngOnDestroy() {
    this.hls?.destroy();
  }
}
