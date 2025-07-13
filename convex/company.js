import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new company
export const addCompany = mutation({
  args: {
    name: v.string(),
    person_one: v.optional(v.string()),
    person_one_phone: v.optional(v.string()),
    person_two: v.optional(v.string()),
    person_two_phone: v.optional(v.string()),
    note: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("company", args);
    const addedCompany = await ctx.db.get(id);


    return { ok: true, addedCompany, message: `تم اضافة شركة ${addedCompany.name} بنجاح` };
  },
});

// Get all companies
export const getCompanies = query({
  args: {},
  handler: async (ctx) => {
    const companies = await ctx.db.query("company").collect();
    return {
      ok: true,
      companies
    };
  },
});

// Get a single company by id
export const getCompanyById = query({
  args: { id: v.id("company") },
  handler: async (ctx, { id }) => {
    const company = await ctx.db.get(id);
    return {
      ok: true,
      company
    };
  },
});

// Update a company
export const updateCompany = mutation({
  args: {
    id: v.id("company"),
    name: v.string(),
    person_one: v.optional(v.string()),
    person_one_phone: v.optional(v.string()),
    person_two: v.optional(v.string()),
    person_two_phone: v.optional(v.string()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...rest }) => {
    const existingConpany = await ctx.db.get(id);
    await ctx.db.patch(existingConpany._id, rest)
    const updatedCompany = await ctx.db.get(id);
    return {
      ok: true,
      message: `تم تحديث معلومات شركة  ${updatedCompany.name} بنجاح`,
      company: updatedCompany,
    };
  },
});

// Delete a company
export const deleteCompany = mutation({
  args: { id: v.id("company") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return {
      ok: true,
      message: "تم حذف الشركة بنجاح",
    };
  },
});
