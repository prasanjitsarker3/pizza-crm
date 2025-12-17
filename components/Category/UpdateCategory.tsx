"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useUpdateCategoryMutation } from "@/redux/Api/categroyApi";

// Updated schema to match DTO
const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

// Slug generator helper
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

interface ICategoryData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
}

interface UpdateCategoryProps {
  categoryData: ICategoryData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UpdateCategory({
  categoryData,
  open,
  onOpenChange,
}: UpdateCategoryProps) {
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      isActive: false,
    },
  });

  // Load category data when dialog opens
  useEffect(() => {
    if (open && categoryData) {
      form.reset({
        name: categoryData.name || "",
        description: categoryData.description || "",
        slug: categoryData.slug || "",
        isActive: categoryData.isActive ?? false,
      });
      setIsSlugManuallyEdited(false);
    }
  }, [open, categoryData, form]);

  const handleNameChange = (value: string) => {
    form.setValue("name", value);
    if (!isSlugManuallyEdited) {
      form.setValue("slug", generateSlug(value));
    }
  };

  const handleSlugChange = (value: string) => {
    setIsSlugManuallyEdited(true);
    form.setValue("slug", generateSlug(value));
  };

  const onSubmit = async (data: CategoryFormValues) => {
    const toastId = toast.loading("Updating category...");
    try {
      // Clean up payload - only send fields that have values
      const payload: any = {
        name: data.name,
        slug: data.slug,
      };

      if (data.description) {
        payload.description = data.description;
      }

      if (data.isActive !== undefined) {
        payload.isActive = data.isActive;
      }

      const response = await updateCategory({
        id: categoryData.id,
        data: payload,
      }).unwrap();

      if (response?.statusCode === 200 || response?.success === true) {
        onOpenChange(false);
        form.reset();
        setIsSlugManuallyEdited(false);
        toast.success(response?.message || "Category updated successfully!", {
          id: toastId,
          duration: 1000,
        });
      } else {
        toast.error(response?.message || "Failed to update category", {
          id: toastId,
          duration: 1000,
        });
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.message || "Something went wrong!",
        { id: toastId, duration: 2000 }
      );
      console.error("Update error:", error);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset to original data
    form.reset({
      name: categoryData.name || "",
      description: categoryData.description || "",
      slug: categoryData.slug || "",
      isActive: categoryData.isActive ?? false,
    });
    setIsSlugManuallyEdited(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] shadow-none border-0 dark:bg-[#1F1F1F]">
        <DialogHeader>
          <DialogTitle>Update Category</DialogTitle>
          <DialogDescription>
            Update the category details. The slug will be auto-generated from
            the name unless you edit it manually.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="My Category"
                      {...field}
                      onChange={(e) => handleNameChange(e.target.value)}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief description of your category"
                      className="resize-none"
                      rows={3}
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Slug <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="my-category"
                      {...field}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Auto-generated from name. You can edit it manually.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <FormDescription>
                      Make this category active and visible
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={isLoading}
                onClick={form.handleSubmit(onSubmit)}
              >
                {isLoading ? "Updating..." : "Update Category"}
              </Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}