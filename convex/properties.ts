import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("properties")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("properties") },
  handler: async (ctx, args) => ctx.db.get(args.id),
});

export const create = mutation({
  args: {
    userId: v.string(),
    address: v.string(),
    city: v.string(),
    state: v.string(),
    zipCode: v.string(),
    price: v.number(),
    bedrooms: v.number(),
    bathrooms: v.number(),
    squareFeet: v.number(),
    propertyType: v.string(),
    status: v.union(v.literal("active"), v.literal("pending"), v.literal("sold")),
    description: v.optional(v.string()),
    features: v.array(v.string()),
    imageUrls: v.array(v.string()),
    yearBuilt: v.optional(v.number()),
    lotSize: v.optional(v.number()),
    mlsNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => ctx.db.insert("properties", args),
});

export const update = mutation({
  args: {
    id: v.id("properties"),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    price: v.optional(v.number()),
    bedrooms: v.optional(v.number()),
    bathrooms: v.optional(v.number()),
    squareFeet: v.optional(v.number()),
    propertyType: v.optional(v.string()),
    status: v.optional(v.union(v.literal("active"), v.literal("pending"), v.literal("sold"))),
    description: v.optional(v.string()),
    features: v.optional(v.array(v.string())),
    imageUrls: v.optional(v.array(v.string())),
    yearBuilt: v.optional(v.number()),
    lotSize: v.optional(v.number()),
    mlsNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("properties") },
  handler: async (ctx, args) => ctx.db.delete(args.id),
});
