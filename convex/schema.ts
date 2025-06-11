import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  worker: defineTable({
    name: v.string(),
    phone: v.optional(v.string()),
    type: v.string(),
    dailyWage: v.number(),
    isPublished: v.boolean(),
  }),

});