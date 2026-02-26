import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const contentTypeValidator = v.union(
  v.literal("listing_description"),
  v.literal("social_instagram"),
  v.literal("social_facebook"),
  v.literal("social_twitter"),
  v.literal("email_campaign"),
  v.literal("sms_blast"),
  v.literal("video_script"),
  v.literal("ad_copy")
);

const statusValidator = v.union(
  v.literal("draft"),
  v.literal("approved"),
  v.literal("published")
);

export const listByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("content")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const listBySource = query({
  args: { sourceId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("content")
      .withIndex("by_source", (q) => q.eq("sourceId", args.sourceId))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("content") },
  handler: async (ctx, args) => ctx.db.get(args.id),
});

export const create = mutation({
  args: {
    userId: v.string(),
    sourceType: v.union(v.literal("property"), v.literal("vehicle")),
    sourceId: v.string(),
    contentType: contentTypeValidator,
    tone: v.optional(v.string()),
    body: v.string(),
    status: statusValidator,
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => ctx.db.insert("content", args),
});

export const updateStatus = mutation({
  args: {
    id: v.id("content"),
    status: statusValidator,
  },
  handler: async (ctx, args) => ctx.db.patch(args.id, { status: args.status }),
});

export const updateBody = mutation({
  args: {
    id: v.id("content"),
    body: v.string(),
  },
  handler: async (ctx, args) => ctx.db.patch(args.id, { body: args.body }),
});

export const remove = mutation({
  args: { id: v.id("content") },
  handler: async (ctx, args) => ctx.db.delete(args.id),
});
