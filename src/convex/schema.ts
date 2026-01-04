import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
  MANUFACTURER: "manufacturer",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
  v.literal(ROLES.MANUFACTURER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
      
      // Additional fields for manufacturers
      companyName: v.optional(v.string()),
      walletAddress: v.optional(v.string()),
      isVerified: v.optional(v.boolean()),
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // Medicines table - stores NFT medicine data
    medicines: defineTable({
      tokenId: v.string(), // NFT token ID from blockchain (Batch ID)
      medicineName: v.string(),
      manufacturerName: v.string(),
      manufacturerId: v.id("users"),
      batchNumber: v.string(),
      medicineType: v.string(), // tablet, syrup, injection, etc.
      manufacturingDate: v.string(),
      expiryDate: v.string(),
      mrp: v.number(),
      quantity: v.number(),
      qrCodeData: v.string(), // QR code content for the batch
      transactionHash: v.string(), // Blockchain transaction hash
      contractAddress: v.string(), // Smart contract address
      isActive: v.boolean(),
    })
      .index("by_manufacturer", ["manufacturerId"])
      .index("by_batch", ["batchNumber"])
      .index("by_token_id", ["tokenId"])
      .index("by_qr_code", ["qrCodeData"]),

    // Individual Medicine Units
    medicine_units: defineTable({
      medicineId: v.id("medicines"),
      tokenId: v.string(), // Unique Token ID for this unit
      serialNumber: v.number(), // 1 to N
      qrCodeData: v.string(), // Unique QR code content
      isVerified: v.boolean(),
      status: v.optional(v.string()), // "minted", "sold", "consumed"
    })
      .index("by_medicine", ["medicineId"])
      .index("by_token_id", ["tokenId"])
      .index("by_qr_code", ["qrCodeData"]),

    // Scan history - tracks all QR code scans
    scanHistory: defineTable({
      medicineId: v.id("medicines"),
      unitId: v.optional(v.id("medicine_units")), // Link to specific unit
      userId: v.optional(v.id("users")),
      scanResult: v.string(), // "genuine" or "counterfeit"
      location: v.optional(v.string()),
      deviceInfo: v.optional(v.string()),
      ipAddress: v.optional(v.string()),
    })
      .index("by_medicine", ["medicineId"])
      .index("by_user", ["userId"]),

    // Counterfeit reports
    reports: defineTable({
      medicineId: v.optional(v.id("medicines")),
      reporterId: v.optional(v.id("users")),
      qrCodeData: v.string(),
      reason: v.string(),
      description: v.optional(v.string()),
      location: v.optional(v.string()),
      status: v.string(), // "pending", "reviewed", "resolved"
      reviewedBy: v.optional(v.id("users")),
      reviewNotes: v.optional(v.string()),
    })
      .index("by_status", ["status"])
      .index("by_reporter", ["reporterId"]),

    // Batches - for bulk medicine creation
    batches: defineTable({
      batchNumber: v.string(),
      manufacturerId: v.id("users"),
      medicineCount: v.number(),
      status: v.string(), // "processing", "completed", "failed"
      metadata: v.optional(v.string()), // JSON string with batch details
    })
      .index("by_manufacturer", ["manufacturerId"])
      .index("by_batch_number", ["batchNumber"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;