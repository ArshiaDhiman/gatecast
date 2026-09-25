import { EventPolicies } from "./event.policies";
import { AuthUser, PolicyContext, PolicyEvent } from "./types";

const admin: AuthUser = { id: 1, role: "admin" };
const owner: AuthUser = { id: 2, role: "organiser" };
const otherOrganiser: AuthUser = { id: 3, role: "organiser" };

const inviteOnlyEvent: PolicyEvent = {
  id: 10,
  ownerId: owner.id,
  visibility: "invite",
};
const publicEvent: PolicyEvent = {
  id: 11,
  ownerId: owner.id,
  visibility: "public",
};

type Case = { who: string; ctx: PolicyContext; allowed: boolean };

describe("EventPolicies", () => {
  describe("edit", () => {
    it.each<Case>([
      { who: "owner", ctx: { user: owner }, allowed: true },
      { who: "other organiser", ctx: { user: otherOrganiser }, allowed: false },
      { who: "admin", ctx: { user: admin }, allowed: false },
      { who: "anonymous", ctx: {}, allowed: false },
    ])("$who → $allowed", ({ ctx, allowed }) => {
      expect(EventPolicies.edit(ctx, inviteOnlyEvent)).toBe(allowed);
    });
  });

  describe("delete", () => {
    it.each<Case>([
      { who: "owner", ctx: { user: owner }, allowed: true },
      { who: "admin", ctx: { user: admin }, allowed: true },
      { who: "other organiser", ctx: { user: otherOrganiser }, allowed: false },
      { who: "anonymous", ctx: {}, allowed: false },
    ])("$who → $allowed", ({ ctx, allowed }) => {
      expect(EventPolicies.delete(ctx, inviteOnlyEvent)).toBe(allowed);
    });
  });

  describe("view (invite-only event)", () => {
    it.each<Case>([
      {
        who: "invitee of this event",
        ctx: { invite: { eventId: 10 } },
        allowed: true,
      },
      {
        who: "invitee of another event",
        ctx: { invite: { eventId: 99 } },
        allowed: false,
      },
      { who: "anonymous", ctx: {}, allowed: false },
      { who: "owner", ctx: { user: owner }, allowed: true },
      { who: "admin", ctx: { user: admin }, allowed: true },
      { who: "other organiser", ctx: { user: otherOrganiser }, allowed: false },
    ])("$who → $allowed", ({ ctx, allowed }) => {
      expect(EventPolicies.view(ctx, inviteOnlyEvent)).toBe(allowed);
    });
  });

  it("anyone can view a public event", () => {
    expect(EventPolicies.view({}, publicEvent)).toBe(true);
  });
});
