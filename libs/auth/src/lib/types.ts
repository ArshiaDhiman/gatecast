export type Role = "admin" | "organiser";

export type AuthUser = {
  id: number;
  role: Role;
};

export type Visibility = "public" | "invite";

export type PolicyEvent = {
  id: number;
  ownerId: number;
  visibility: Visibility;
};

export type PolicyContext = {
  user?: AuthUser;
  invite?: { eventId: number };
};

export type Policy = (ctx: PolicyContext, event: PolicyEvent) => boolean;
