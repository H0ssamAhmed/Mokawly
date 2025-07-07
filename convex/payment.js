import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Add a new payment for a company
export const addPayment = mutation({
  args: {
    companyId: v.id("company"),
    companyName: v.string(),
    amount: v.number(),
    date: v.string(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("payment", args);
    const addedPayment = await ctx.db.get(id);
    return {
      ok: true,
      payment: addedPayment,
      message: "تم إضافة دفعة جديدة بنجاح",
    };
  },
});

// Get all payments
export const getAllPayments = query({
  args: {},
  handler: async (ctx) => {
    const payments = await ctx.db.query("payment").collect();
    return {
      ok: true,
      payments,
    };
  },
});

// Get all payments for a specific company by companyId
export const getPaymentsByCompanyId = query({
  args: { companyId: v.id("company") },
  handler: async (ctx, { companyId }) => {
    const payments = await ctx.db
      .query("payment")
      .withIndex("by_companyId", (q) => q.eq("companyId", companyId))
      .collect();
    return {
      ok: true,
      payments,
    };
  },
});

// Delete a payment by id
export const deletePayment = mutation({
  args: { id: v.id("payment") },
  handler: async (ctx, { id }) => {
    const deletedId = await ctx.db.delete(id);
    console.log(deletedId);

    return {
      ok: true,
      message: "تم حذف الدفعة بنجاح",
    };
  },
});
