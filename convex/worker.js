import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addWorker = mutation({
  args: {
    name: v.string(),
    phone: v.optional(v.string()),
    type: v.string(),
    dailyWage: v.number(),
    isPublished: v.boolean(),
  },
  handler: async (ctx, { name, phone, type, dailyWage, isPublished }) => {
    const workerId = await ctx.db.insert("worker", { name, phone, type, dailyWage, isPublished });
    const worker = await ctx.db.get(workerId);
    return worker;
  },
});
