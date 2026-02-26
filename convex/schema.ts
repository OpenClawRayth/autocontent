import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users / workspaces
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    industry: v.optional(v.union(v.literal("real_estate"), v.literal("auto"))),
    companyName: v.optional(v.string()),
    plan: v.union(v.literal("free"), v.literal("starter"), v.literal("pro"), v.literal("agency")),
    generationsUsed: v.number(),
    generationsLimit: v.number(),
    onboardingComplete: v.boolean(),
  }).index("by_clerk_id", ["clerkId"]),

  // Real estate listings
  properties: defineTable({
    userId: v.string(),
    address: v.string(),
    city: v.string(),
    state: v.string(),
    zipCode: v.string(),
    price: v.number(),
    bedrooms: v.number(),
    bathrooms: v.number(),
    squareFeet: v.number(),
    propertyType: v.string(), // house, condo, townhouse, land, commercial
    status: v.union(v.literal("active"), v.literal("pending"), v.literal("sold")),
    description: v.optional(v.string()),
    features: v.array(v.string()),
    imageUrls: v.array(v.string()),
    yearBuilt: v.optional(v.number()),
    lotSize: v.optional(v.number()),
    mlsNumber: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  // Vehicle inventory
  vehicles: defineTable({
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
  }).index("by_user", ["userId"]),

  // Generated content pieces
  content: defineTable({
    userId: v.string(),
    sourceType: v.union(v.literal("property"), v.literal("vehicle")),
    sourceId: v.string(), // property or vehicle _id
    contentType: v.union(
      v.literal("listing_description"),
      v.literal("social_instagram"),
      v.literal("social_facebook"),
      v.literal("social_twitter"),
      v.literal("email_campaign"),
      v.literal("sms_blast"),
      v.literal("video_script"),
      v.literal("ad_copy")
    ),
    tone: v.optional(v.string()), // professional, casual, luxury, energetic
    body: v.string(),
    status: v.union(v.literal("draft"), v.literal("approved"), v.literal("published")),
    metadata: v.optional(v.any()),
  })
    .index("by_user", ["userId"])
    .index("by_source", ["sourceId"]),

  // Generation history / audit log
  generations: defineTable({
    userId: v.string(),
    contentId: v.string(),
    model: v.string(),
    promptTokens: v.number(),
    completionTokens: v.number(),
    totalTokens: v.number(),
    durationMs: v.number(),
  }).index("by_user", ["userId"]),
});
