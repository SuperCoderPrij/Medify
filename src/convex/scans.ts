import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Record a scan
export const recordScan = mutation({
  args: {
    medicineId: v.id("medicines"),
    scanResult: v.string(),
    location: v.optional(v.string()),
    deviceInfo: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    const scanId = await ctx.db.insert("scanHistory", {
      ...args,
      userId: userId || undefined,
    });

    return scanId;
  },
});

// Get scan history for a user
export const getUserScanHistory = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const limit = args.limit || 50;
    const scans = await ctx.db
      .query("scanHistory")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);

    // Get medicine details for each scan
    const scansWithMedicines = await Promise.all(
      scans.map(async (scan) => {
        const medicine = await ctx.db.get(scan.medicineId);
        return {
          ...scan,
          medicine,
        };
      })
    );

    return scansWithMedicines;
  },
});

// Get scan statistics for a medicine
export const getMedicineScanStats = query({
  args: { medicineId: v.id("medicines") },
  handler: async (ctx, args) => {
    const scans = await ctx.db
      .query("scanHistory")
      .withIndex("by_medicine", (q) => q.eq("medicineId", args.medicineId))
      .collect();

    const totalScans = scans.length;
    const genuineScans = scans.filter((s) => s.scanResult === "genuine").length;
    const counterfeitScans = scans.filter(
      (s) => s.scanResult === "counterfeit"
    ).length;

    return {
      totalScans,
      genuineScans,
      counterfeitScans,
    };
  },
});
