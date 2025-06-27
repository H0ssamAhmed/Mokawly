import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addWorker = mutation({
  args: {
    name: v.string(),
    phone: v.optional(v.string()),
    type: v.string(),
    dailyWage: v.number(),
    isPublished: v.boolean(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, { name, phone, type, dailyWage, isPublished, note }) => {
    const workerId = await ctx.db.insert("worker", { name, phone, type, dailyWage, isPublished, note });
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
      return { ok: false, message: " عامل غير موجود", worker: null };
    }
    if (!worker.isPublished) {
      return { ok: true, message: "بيانات العامل غير مفتوحة- يرجى التواصل مع احد المسؤليين", worker: null };
    }
    return { ok: true, message: "بيانات العامل مفتوحة", worker };
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
    note: v.optional(v.string()),

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

export const getWorkerDate = query({
  args: { id: v.id("worker") }, // تأكد ان اسم الـ table صح

  handler: async (ctx, { id }) => {
    // Get worker details
    const worker = await ctx.db.get(id);

    if (!worker) {
      return { ok: false, error: "Worker not found" };
    }

    // Get all attendance records for this worker
    const workerAttendance = await ctx.db
      .query("attendance")
      .withIndex("by_workerId", (q) => q.eq("workerId", id))
      .collect();

    // Get all expenses for this worker
    const workerExpenses = await ctx.db
      .query("workerExpense")
      .withIndex("by_workerId", (q) => q.eq("workerId", id))
      .collect();

    return {
      ok: true,
      worker,
      attendance: workerAttendance,
      expenses: workerExpenses,
    };
  },
})

export const getPublicWorkerDate = query({
  args: { id: v.id("worker") }, // تأكد ان اسم الـ table صح

  handler: async (ctx, { id }) => {
    // Get worker details
    const worker = await ctx.db.get(id) || null;

    if (!worker) {
      return { ok: false, error: "العامل غير موجود" };
    }
    if (!worker.isPublished) {

      return {
        ok: true,
        isPublished: worker.isPublished,
        message: "بيانات العامل غير مفتوحة- يرجى التواصل مع احد المسؤليين",
        data: {
          worker: null,
          attendance: [],
          expenses: [],
        }
      }
    }

    // Get all attendance records for this worker
    const workerAttendance = await ctx.db
      .query("attendance")
      .withIndex("by_workerId", (q) => q.eq("workerId", id))
      .collect();

    // Get all expenses for this worker
    const workerExpenses = await ctx.db
      .query("workerExpense")
      .withIndex("by_workerId", (q) => q.eq("workerId", id))
      .collect();

    return {
      ok: true,
      isPublished: worker.isPublished,
      data: {
        worker,
        attendance: workerAttendance,
        expenses: workerExpenses,
      }
    };
  },
})