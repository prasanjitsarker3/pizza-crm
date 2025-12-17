import * as z from "zod";


export const brandSchema = z
    .object({
        name: z
            .string()
            .min(1, "Name is required")
            .max(100, "Name must be less than 100 characters"),
        description: z.string().optional(),
        slug: z
            .string()
            .min(1, "Slug is required")
            .max(100, "Slug must be less than 100 characters")
            .regex(
                /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                "Slug must be lowercase letters, numbers, and hyphens only"
            ),
        isDisplay: z.boolean(),
    })
    .required({
        isDisplay: true,
    });




export function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
}