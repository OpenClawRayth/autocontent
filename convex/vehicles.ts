import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("vehicles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("vehicles").order("desc").collect();
  },
});

export const get = query({
  args: { id: v.id("vehicles") },
  handler: async (ctx, args) => ctx.db.get(args.id),
});

export const create = mutation({
  args: {
    userId: v.string(),
    vin: v.optional(v.string()),
    year: v.number(),
    make: v.string(),
    model: v.string(),
    trim: v.optional(v.string()),
    mileage: v.number(),
    price: v.number(),
    condition: v.union(v.literal("new"), v.literal("used"), v.literal("certified")),
    color: v.optional(v.string()),
    interiorColor: v.optional(v.string()),
    transmission: v.optional(v.string()),
    drivetrain: v.optional(v.string()),
    engine: v.optional(v.string()),
    fuelType: v.optional(v.string()),
    status: v.union(v.literal("available"), v.literal("pending"), v.literal("sold")),
    features: v.array(v.string()),
    imageUrls: v.array(v.string()),
    stockNumber: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => ctx.db.insert("vehicles", args),
});

export const update = mutation({
  args: {
    id: v.id("vehicles"),
    vin: v.optional(v.string()),
    year: v.optional(v.number()),
    make: v.optional(v.string()),
    model: v.optional(v.string()),
    trim: v.optional(v.string()),
    mileage: v.optional(v.number()),
    price: v.optional(v.number()),
    condition: v.optional(v.union(v.literal("new"), v.literal("used"), v.literal("certified"))),
    color: v.optional(v.string()),
    interiorColor: v.optional(v.string()),
    transmission: v.optional(v.string()),
    drivetrain: v.optional(v.string()),
    engine: v.optional(v.string()),
    fuelType: v.optional(v.string()),
    status: v.optional(v.union(v.literal("available"), v.literal("pending"), v.literal("sold"))),
    features: v.optional(v.array(v.string())),
    imageUrls: v.optional(v.array(v.string())),
    stockNumber: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("vehicles") },
  handler: async (ctx, args) => ctx.db.delete(args.id),
});
