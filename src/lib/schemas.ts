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

    if (value.role === "admin") {
      context.addIssue({
        code: "custom",
        path: ["role"],
        message: "Admins can only be created by an authenticated admin.",
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
  id: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().trim().min(1).optional()
  ),
  name: z.string().trim().min(3, "Product name must be at least 3 characters."),
  seller: z.string().trim().min(2, "Seller name is required."),
  sellerLocation: z.string().trim().optional(),
  price: z.coerce.number().min(1, "Price must be greater than 0."),
  category: z.string().trim().min(1, "Choose a category."),
  image: z.string().trim().min(1, "Choose an image."),
  galleryImages: z.array(z.string().trim().min(1)).default([]),
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

export const checkoutItemSchema = z.object({
  productId: z.string().trim().min(1),
  quantity: z.coerce.number().int().min(1).max(99),
})

export const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2, "Full name is required."),
    email: z.string().trim().email("Enter a valid email address."),
    street: z.string().trim().min(4, "Street address is required."),
    apartment: z.string().trim().optional(),
    city: z.string().trim().min(2, "City is required."),
    postalCode: z.string().trim().min(3, "ZIP or postal code is required."),
  }),
  paymentMethod: z.enum(["card", "wallet"]).default("card"),
  items: z.array(checkoutItemSchema).min(1, "Your cart is empty."),
})

export type ProductInput = z.infer<typeof productInputSchema>
export type AuthRegistrationInput = z.infer<typeof authRegistrationSchema>
export type AuthLoginInput = z.infer<typeof authLoginSchema>
export type AdminCreateInput = z.infer<typeof adminCreateSchema>
export type UserRole = z.infer<typeof userRoleSchema>
export type SellerRegistrationInput = z.infer<typeof sellerRegistrationSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
