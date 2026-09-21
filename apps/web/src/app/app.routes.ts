import { Route } from "@angular/router";
import { Organiser } from "./events/organiser";
import { Viewer } from "./events/viewer";
import { Edit } from "./events/edit";

export const appRoutes: Route[] = [
  { path: "", component: Organiser },
  {
    path: "watch/:token",
    component: Viewer,
  },
  { path: "events/:id", component: Edit },
];
