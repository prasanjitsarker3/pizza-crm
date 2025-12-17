
import * as z from "zod";


export const userSchema = z
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


export const getRoleBadgeColor = (roleName: string) => {
    switch (roleName.toUpperCase()) {
        case "ADMIN":
            return "bg-purple-100 text-purple-800 hover:bg-purple-200";
        case "VENDOR":
            return "bg-orange-100 text-orange-800 hover:bg-orange-200";
        case "USER":
            return "bg-blue-100 text-blue-800 hover:bg-blue-200";
        default:
            return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
};


export const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};
