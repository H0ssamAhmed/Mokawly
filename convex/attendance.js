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
    console.log(records);
    let totalIds = []

    for (const record of records) {
      const insertedRecsId = await ctx.db.insert("attendance", record)
    }

    // console.log(totalIds.length);
    // console.log(records);




    return {
      ok: true,
      message: "تم حفظ حضور اليوم بنجاح",
      records: records

    };
  },
});


// Get all attendance records
export const getAttendanceRecords = query({
  args: {},

  handler: async (ctx) => {
    const records = await ctx.db
      .query("attendance")
      .collect();
    return {
      ok: true,
      records
    };

  },
  // This if i want to get today and yestday attendance
  // args: {},

  // handler: async (ctx) => {
  //   const today = new Date();
  //   const todayISO = today.toISOString().slice(0, 10);

  //   const yesterday = new Date();
  //   yesterday.setDate(today.getDate() - 1);
  //   const yesterdayISO = yesterday.toISOString().slice(0, 10);

  //   const recordsToday = await ctx.db
  //     .query("attendance")
  //     .withIndex("by_date", (q) => q.eq("date", todayISO))
  //     .collect();

  //   const recordsYesterday = await ctx.db
  //     .query("attendance")
  //     .withIndex("by_date", (q) => q.eq("date", yesterdayISO))
  //     .collect();

  //   return {
  //     ok: true,
  //     records: [...recordsToday, ...recordsYesterday],
  //   };
  // },
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

