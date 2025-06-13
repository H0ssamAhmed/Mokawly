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
    return { ok: true, worker };
  },
});

export const getWorkers = query({
  handler: async (ctx) => {
    const workers = await ctx.db.query("worker").collect();
    return { ok: true, workers };
  },
});

export const getWorker = query({
  args: { id: v.id("worker") },
  handler: async (ctx, { id }) => {
    const worker = await ctx.db.get(id);
    if (!worker) {
      throw new ConvexError("Worker not found");
    }
    return { ok: true, worker };
  },
});

export const updateWorker = mutation({
  args: {
    id: v.id("worker"),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    type: v.optional(v.string()),
    dailyWage: v.optional(v.number()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, ...updates }) => {
    const existingWorker = await ctx.db.get(id);
    await ctx.db.patch(existingWorker._id, updates);
    const updatedWorker = await ctx.db.get(id);
    return { ok: true, worker: updatedWorker };
  },

});

export const deleteWorker = mutation({
  args: { id: v.id("worker") },
  handler: async (ctx, { id }) => {
    const existingWorker = await ctx.db.get(id);
    if (!existingWorker) {
      throw new ConvexError("Worker not found");
    }
    await ctx.db.delete(id);
    return { ok: true, message: "Worker deleted successfully" };
  },
});
export const publishWorker = mutation({
  args: { id: v.id("worker") },
  handler: async (ctx, { id }) => {
    const existingWorker = await ctx.db.get(id);
    if (!existingWorker) {
      throw new ConvexError("Worker not found");
    }
    const reversePublished = existingWorker.isPublished ? false : true;
    await ctx.db.patch(id, { isPublished: reversePublished });
    return { ok: true, message: "Worker published successfully" };
  },
})