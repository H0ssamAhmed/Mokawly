import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getStatistics = query({
  args: {},
  handler: async (ctx) => {
    const allWorkers = await ctx.db.query("worker").collect();
    const allPayments = await ctx.db.query("payment").collect();
    const allWorkersExpenses = await ctx.db.query("workerExpense").collect();
    const allJobExpenses = await ctx.db.query("jobExpense").collect();

    const totalPayment = allPayments.reduce((total, payment) => (+total) + +(payment.amount), 0)
    const totalJobExpenses = allJobExpenses.reduce((total, expense) => (+total) + +(expense.amount), 0)
    const totalworkersExpenses = allWorkersExpenses.reduce((total, expense) => (+total) + +(expense.amount), 0)
    const totalworkerDailyWage = allWorkers.reduce((total, worker) => (+total) + +(worker.dailyWage), 0)
    return {
      allWorkers,
      totalPayment,
      totalJobExpenses,
      totalworkersExpenses,
      totalworkerDailyWage,
      totalPaymentLength: allPayments,
    };
  },
});