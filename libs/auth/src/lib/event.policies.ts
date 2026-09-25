import { Policy, PolicyContext, PolicyEvent } from "./types";

const isOwner = (ctx: PolicyContext, event: PolicyEvent) => {
  return ctx.user !== undefined && ctx.user.id === event.ownerId;
};

const isAdmin = (ctx: PolicyContext) => {
  return ctx.user?.role === "admin";
};

export const EventPolicies = {
  view: (ctx, event) =>
    event.visibility === "public" ||
    ctx.invite?.eventId === event.id ||
    isOwner(ctx, event) ||
    isAdmin(ctx),

  edit: (ctx, event) => isOwner(ctx, event),

  delete: (ctx, event) => isAdmin(ctx) || isOwner(ctx, event),
} satisfies Record<string, Policy>;

export type EventAction = keyof typeof EventPolicies;
