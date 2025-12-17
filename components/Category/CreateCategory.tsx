"use client";

import { useState } from "react";
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
  DialogTrigger,
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
import { useCreateCollectionMutation } from "@/redux/Api/collectionApi";
import { useCreateNewCategoryMutation } from "@/redux/Api/categroyApi";

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

const CreateCategory = () => {
  const [open, setOpen] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [createCategory, { isLoading }] = useCreateNewCategoryMutation();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      isActive: false,
    },
  });

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
    const toastId = toast.loading("Creating category...");
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

      const response = await createCategory(payload).unwrap();

      if (response?.statusCode === 201 || response?.success === true) {
        setOpen(false);
        form.reset();
        setIsSlugManuallyEdited(false);
        toast.success(response?.message || "Category created successfully!", {
          id: toastId,
          duration: 1000,
        });
      } else {
        toast.error(response?.message || "Failed to create category", {
          id: toastId,
          duration: 1000,
        });
      }
    } catch (error: any) {
      console.error("Error creating category:", error);
      toast.error(
        error?.data?.message || error?.message || "Something went wrong!",
        { id: toastId, duration: 2000 }
      );
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      form.reset();
      setIsSlugManuallyEdited(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="dark:bg-[#ff7200] dark:text-white">
          Create Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] shadow-none border-0 dark:bg-[#1F1F1F]">
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
          <DialogDescription>
            Add a new category to your library. The slug will be auto-generated
            from the name.
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
                onClick={() => handleOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={isLoading}
                onClick={form.handleSubmit(onSubmit)}
              >
                {isLoading ? "Creating..." : "Create Category"}
              </Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategory;