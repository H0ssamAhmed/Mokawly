import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Save attendance record
export const saveAttendances = mutation({
  args: {
    records: v.array(
      v.object({
        workerId: v.id("worker"),
        name: v.string(),        // optional if you store name separately
        dailyWage: v.number(),
        date: v.string(),
        note: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, { records }) => {
    for (const record of records) {
      const recordId = await ctx.db.insert("attendance", record)
    }

    return {
      ok: true,
      message: "Attendance records saved successfully",

    };
  },
});


// Get all attendance records
export const getAttendanceRecords = query({
  args: {},
  handler: async (ctx) => {
    const records = await ctx.db
      .query("attendance")
      .withIndex("workerId")
      .order("desc")
      .collect();

    return records;
  },
});

// Get attendance for a specific date
export const getAttendanceByDate = query({
  args: { date: v.string() },
  handler: async (ctx, { date }) => {
    const record = await ctx.db
      .query("attendance")
      .withIndex("by_date", (q) => q.eq("date", date))
      .first();

    return record;
  },
});

// Delete attendance record
export const deleteAttendance = mutation({
  args: { id: v.id("attendance") },
  handler: async (ctx, { id }) => {
    const existingRecord = await ctx.db.get(id);
    if (!existingRecord) {
      throw new ConvexError("Attendance record not found");
    }
    await ctx.db.delete(id);
    return { ok: true, message: "Attendance record deleted successfully" };
  },
});

