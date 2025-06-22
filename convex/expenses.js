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
    if (expenseId) {
      const expense = await ctx.db.get(expenseId);
      return { ok: true, expense };
    }
    return { ok: false, message: "فشل في اضافة  المبلغ حاول مجدداً" };

  },
});

export const AddworkerExpense = mutation({
  args: {
    workerId: v.id("worker"),
    workerName: v.string(),
    paidBy: v.string(),
    amount: v.number(),
    date: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { workerId, workerName, paidBy, amount, date, description }) => {
    const workerExpenseId = await ctx.db.insert("workerExpense", { workerId, workerName, paidBy, amount, date, description });

    if (workerExpenseId) {
      const workerExpense = await ctx.db.get(workerExpenseId);
      return { ok: true, workerExpense };
    }
    return { ok: false, message: "فشل في اضافة المصروف حاول مجدداً" };

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