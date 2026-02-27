import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const upsertUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existing) return existing._id;

    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      plan: "free",
      generationsUsed: 0,
      generationsLimit: 10,
      onboardingComplete: false,
    });
  },
});

export const getUser = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();
  },
});

export const updateProfile = mutation({
  args: {
    clerkId: v.string(),
    companyName: v.optional(v.string()),
    industry: v.optional(v.union(v.literal("real_estate"), v.literal("auto"))),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) throw new Error("User not found");

    const patch: Record<string, unknown> = {};
    if (args.companyName !== undefined) patch.companyName = args.companyName;
    if (args.industry !== undefined) patch.industry = args.industry;
    if (args.name !== undefined) patch.name = args.name;

    await ctx.db.patch(user._id, patch);
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").order("desc").collect();
  },
});

export const upsertAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", "admin_bypass"))
      .unique();
    if (existing) return existing._id;
    return await ctx.db.insert("users", {
      clerkId: "admin_bypass",
      email: "admin@autocontent.ai",
      name: "Admin",
      plan: "agency",
      generationsUsed: 0,
      generationsLimit: 99999,
      onboardingComplete: true,
      companyName: "AutoContent",
      industry: "real_estate",
    });
  },
});

export const completeOnboarding = mutation({
  args: {
    clerkId: v.string(),
    industry: v.union(v.literal("real_estate"), v.literal("auto")),
    companyName: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      industry: args.industry,
      companyName: args.companyName,
      onboardingComplete: true,
    });
  },
});
