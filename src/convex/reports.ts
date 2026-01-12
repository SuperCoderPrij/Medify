import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Submit a counterfeit report
export const submitReport = mutation({
  args: {
    medicineId: v.optional(v.id("medicines")),
    qrCodeData: v.optional(v.string()),
    medicineName: v.optional(v.string()),
    batchNumber: v.optional(v.string()),
    reason: v.string(),
    description: v.optional(v.string()),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    const reportId = await ctx.db.insert("reports", {
      ...args,
      reporterId: userId || undefined,
      status: "pending",
    });

    return reportId;
  },
});

// Get public reports (recent)
export const getPublicReports = query({
  args: {},
  handler: async (ctx) => {
    const reports = await ctx.db.query("reports")
      .order("desc")
      .take(20);
      
    return reports.map(r => ({
      _id: r._id,
      _creationTime: r._creationTime,
      medicineName: r.medicineName || "Unknown Medicine",
      batchNumber: r.batchNumber,
      reason: r.reason,
      location: r.location,
      status: r.status,
      description: r.description
    }));
  },
});

// Get all reports for manufacturer
export const getManufacturerReports = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    // Get all medicines by this manufacturer
    const medicines = await ctx.db
      .query("medicines")
      .withIndex("by_manufacturer", (q) => q.eq("manufacturerId", userId))
      .collect();

    const medicineIds = new Set(medicines.map((m) => m._id));
    const batchNumbers = new Set(medicines.map((m) => m.batchNumber));
    const medicineNames = new Set(medicines.map((m) => m.medicineName.toLowerCase()));

    // Get all reports
    const allReports = await ctx.db.query("reports").collect();

    // Filter reports related to this manufacturer's medicines
    const manufacturerReports = allReports.filter((report) => {
      // Direct match by ID
      if (report.medicineId && medicineIds.has(report.medicineId)) return true;
      
      // Match by Batch Number
      if (report.batchNumber && batchNumbers.has(report.batchNumber)) return true;

      // Match by Name (case-insensitive)
      if (report.medicineName && medicineNames.has(report.medicineName.toLowerCase())) return true;

      return false;
    });

    // Get medicine details for each report
    const reportsWithMedicines = await Promise.all(
      manufacturerReports.map(async (report) => {
        let medicine = null;
        
        if (report.medicineId) {
          medicine = await ctx.db.get(report.medicineId);
        } else if (report.batchNumber) {
          // Try to find medicine by batch number if ID is missing
          // We filter the manufacturer's medicines we already fetched to avoid extra queries
          medicine = medicines.find(m => m.batchNumber === report.batchNumber) || null;
        }

        return {
          ...report,
          medicine,
        };
      })
    );

    return reportsWithMedicines;
  },
});

// Update report status
export const updateReportStatus = mutation({
  args: {
    reportId: v.id("reports"),
    status: v.string(),
    reviewNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    await ctx.db.patch(args.reportId, {
      status: args.status,
      reviewedBy: userId,
      reviewNotes: args.reviewNotes,
    });

    return { success: true };
  },
});