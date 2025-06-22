import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addJobExpense = mutation({
  args: {
    type: v.string(),
    description: v.string(),
    paidBy: v.string(),
    amount: v.number(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const expenseId = await ctx.db.insert("jobExpense", args);
    return { ok: true, expenseId };
  },
});

export const addWorkerExpense = mutation({
  args: {
    workerId: v.id("worker"),
    workerName: v.string(),
    paidBy: v.string(),
    amount: v.number(),
    date: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const expenseId = await ctx.db.insert("workerExpense", args);
    return { ok: true, expenseId };
  },
});

export const getJobExpenses = query({
  handler: async (ctx) => {
    const expenses = await ctx.db.query("jobExpense").collect();
    return { ok: true, expenses };
  },
});

export const getWorkerExpenses = query({
  handler: async (ctx) => {
    const expenses = await ctx.db.query("workerExpense").collect();
    return { ok: true, expenses };
  },
}); 