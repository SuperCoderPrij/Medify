import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Create a new medicine NFT
export const createMedicine = mutation({
  args: {
    tokenId: v.string(),
    medicineName: v.string(),
    manufacturerName: v.string(),
    batchNumber: v.string(),
    medicineType: v.string(),
    manufacturingDate: v.string(),
    expiryDate: v.string(),
    mrp: v.number(),
    quantity: v.number(),
    qrCodeData: v.string(),
    transactionHash: v.string(),
    contractAddress: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const medicineId = await ctx.db.insert("medicines", {
      ...args,
      manufacturerId: userId,
      isActive: true,
    });

    return medicineId;
  },
});

// Get medicine by token ID
export const getMedicineByTokenId = query({
  args: { tokenId: v.string() },
  handler: async (ctx, args) => {
    const medicine = await ctx.db
      .query("medicines")
      .withIndex("by_token_id", (q) => q.eq("tokenId", args.tokenId))
      .first();

    return medicine;
  },
});

// Get medicine by QR code data
export const getMedicineByQRCode = query({
  args: { qrCodeData: v.string() },
  handler: async (ctx, args) => {
    const medicines = await ctx.db.query("medicines").collect();
    const medicine = medicines.find((m) => m.qrCodeData === args.qrCodeData);
    return medicine || null;
  },
});

// Get all medicines for a manufacturer
export const getManufacturerMedicines = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const medicines = await ctx.db
      .query("medicines")
      .withIndex("by_manufacturer", (q) => q.eq("manufacturerId", userId))
      .order("desc")
      .take(100);

    return medicines;
  },
});

// Get medicines by batch number
export const getMedicinesByBatch = query({
  args: { batchNumber: v.string() },
  handler: async (ctx, args) => {
    const medicines = await ctx.db
      .query("medicines")
      .withIndex("by_batch", (q) => q.eq("batchNumber", args.batchNumber))
      .collect();

    return medicines;
  },
});

// Get medicine statistics for manufacturer
export const getManufacturerStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const medicines = await ctx.db
      .query("medicines")
      .withIndex("by_manufacturer", (q) => q.eq("manufacturerId", userId))
      .collect();

    const totalMedicines = medicines.length;
    const activeMedicines = medicines.filter((m) => m.isActive).length;

    // Get total scans
    const allScans = await ctx.db.query("scanHistory").collect();
    const medicineIds = new Set(medicines.map((m) => m._id));
    const totalScans = allScans.filter((scan) =>
      medicineIds.has(scan.medicineId)
    ).length;

    // Get reports
    const allReports = await ctx.db.query("reports").collect();
    const recentReports = allReports.filter((report) => {
      if (!report.medicineId) return false;
      return medicineIds.has(report.medicineId);
    }).length;

    return {
      totalMedicines,
      activeMedicines,
      totalScans,
      recentReports,
    };
  },
});

// Toggle medicine active status
export const toggleMedicineStatus = mutation({
  args: { id: v.id("medicines"), isActive: v.boolean() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const medicine = await ctx.db.get(args.id);
    if (!medicine) {
      throw new Error("Medicine not found");
    }

    if (medicine.manufacturerId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, { isActive: args.isActive });
  },
});