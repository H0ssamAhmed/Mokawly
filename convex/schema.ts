import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  worker: defineTable({
    name: v.string(),
    phone: v.optional(v.string()),
    type: v.string(),
    dailyWage: v.number(),
    isPublished: v.boolean(),
    note: v.optional(v.string()),
  }),

  attendance: defineTable({
    workerId: v.id("worker"),
    date: v.string(),
    name: v.string(),
    dailyWage: v.number(),
  }).index("by_workerId", ["workerId"])
    .index("by_date", ["date"]),

  workerExpense: defineTable({
    workerId: v.id("worker"),
    workerName: v.string(),
    paidBy: v.string(),
    amount: v.number(),
    date: v.string(),
    description: v.optional(v.string()),
  }),

  jobExpense: defineTable({
    type: v.string(),
    description: v.string(),
    paidBy: v.string(),
    amount: v.number(),
    date: v.string(),
  }),
});