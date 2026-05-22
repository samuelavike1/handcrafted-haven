import { z } from "zod"

export const userRoleSchema = z.enum(["buyer", "seller", "admin"])

export const authRegistrationSchema = z
  .object({
    name: z.string().trim().min(2, "Your name is required."),
    email: z.string().trim().email("Enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    role: userRoleSchema.default("buyer"),
    studioName: z.string().trim().optional(),
    location: z.string().trim().optional(),
    story: z.string().trim().optional(),
    adminCode: z.string().trim().optional(),
  })
  .superRefine((value, context) => {
    if (value.role === "seller") {
      if (!value.studioName || value.studioName.length < 2) {
        context.addIssue({
          code: "custom",
          path: ["studioName"],
          message: "Studio name is required for sellers.",
        })
      }
      if (!value.location || value.location.length < 2) {
        context.addIssue({
          code: "custom",
          path: ["location"],
          message: "Location is required for sellers.",
        })
      }
      if (!value.story || value.story.length < 30) {
        context.addIssue({
          code: "custom",
          path: ["story"],
          message: "Tell buyers a little more about your craft.",
        })
      }
    }

    if (value.role === "admin" && value.adminCode !== "HAVEN_ADMIN_DEMO") {
      context.addIssue({
        code: "custom",
        path: ["adminCode"],
        message: "Enter the admin invitation code.",
      })
    }
  })

export const authLoginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
  role: userRoleSchema.optional(),
})

export const adminCreateSchema = z.object({
  name: z.string().trim().min(2, "Admin name is required."),
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
})

export const productInputSchema = z.object({
  id: z.string().trim().min(1).optional(),
  name: z.string().trim().min(3, "Product name must be at least 3 characters."),
  seller: z.string().trim().min(2, "Seller name is required."),
  sellerLocation: z.string().trim().optional(),
  price: z.coerce.number().min(1, "Price must be greater than 0."),
  category: z.string().trim().min(1, "Choose a category."),
  image: z.string().trim().min(1, "Choose an image."),
  badge: z.string().trim().optional(),
  materials: z.array(z.string().trim()).default([]),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters."),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative."),
  status: z.enum(["Active", "Low stock", "Draft"]).default("Draft"),
})

export const sellerRegistrationSchema = z.object({
  name: z.string().trim().min(2, "Your name is required."),
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  studioName: z.string().trim().min(2, "Studio name is required."),
  location: z.string().trim().min(2, "Location is required."),
  story: z
    .string()
    .trim()
    .min(30, "Tell buyers a little more about your craft."),
})

export const sellerLoginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
})

export type ProductInput = z.infer<typeof productInputSchema>
export type AuthRegistrationInput = z.infer<typeof authRegistrationSchema>
export type AuthLoginInput = z.infer<typeof authLoginSchema>
export type AdminCreateInput = z.infer<typeof adminCreateSchema>
export type UserRole = z.infer<typeof userRoleSchema>
export type SellerRegistrationInput = z.infer<typeof sellerRegistrationSchema>
