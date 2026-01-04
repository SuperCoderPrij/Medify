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

    // 1. Create the Batch Record
    const medicineId = await ctx.db.insert("medicines", {
      ...args,
      manufacturerId: userId,
      isActive: true,
    });

    // 2. Create Individual Units
    // Limit quantity to prevent timeout/abuse for this demo
    const quantity = Math.min(args.quantity, 100); 

    for (let i = 1; i <= quantity; i++) {
      const unitTokenId = `${args.tokenId}-${i}`;
      const unitQrData = JSON.stringify({
        id: unitTokenId,
        batch: args.batchNumber,
        contract: args.contractAddress,
        unit: i
      });

      await ctx.db.insert("medicine_units", {
        medicineId,
        tokenId: unitTokenId,
        serialNumber: i,
        qrCodeData: unitQrData,
        isVerified: true,
        status: "minted"
      });
    }

    return medicineId;
  },
});

// Get medicine units for a medicine
export const getMedicineUnits = query({
  args: { medicineId: v.id("medicines") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("medicine_units")
      .withIndex("by_medicine", (q) => q.eq("medicineId", args.medicineId))
      .collect();
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

// Get medicine details by unit token ID
export const getMedicineByUnitTokenId = query({
  args: { tokenId: v.string() },
  handler: async (ctx, args) => {
    const unit = await ctx.db
      .query("medicine_units")
      .withIndex("by_token_id", (q) => q.eq("tokenId", args.tokenId))
      .first();

    if (!unit) return null;

    const medicine = await ctx.db.get(unit.medicineId);
    if (!medicine) return null;

    return {
      ...medicine,
      unit,
    };
  },
});

// Get medicine by QR code data
export const getMedicineByQRCode = query({
  args: { qrCodeData: v.string() },
  handler: async (ctx, args) => {
    // Try to find in medicines (batch QR)
    const medicine = await ctx.db
      .query("medicines")
      .withIndex("by_qr_code", (q) => q.eq("qrCodeData", args.qrCodeData))
      .first();
    
    if (medicine) return medicine;

    // Try to find in medicine_units (unit QR)
    const unit = await ctx.db
      .query("medicine_units")
      .withIndex("by_qr_code", (q) => q.eq("qrCodeData", args.qrCodeData))
      .first();

    if (unit) {
      const parentMedicine = await ctx.db.get(unit.medicineId);
      if (parentMedicine) {
        return {
          ...parentMedicine,
          unit
        };
      }
    }

    return null;
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

// Delete a medicine
export const deleteMedicine = mutation({
  args: { id: v.id("medicines") },
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

    await ctx.db.delete(args.id);
  },
});