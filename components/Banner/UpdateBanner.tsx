"use client";

import type React from "react";
import { useState, useCallback, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2, Upload, X, Image, Video } from "lucide-react";
import { z } from "zod";
import { ScrollArea } from "../ui/scroll-area";
import { fileUpload } from "@/actions/file";
import { toast } from "sonner";
import type { IBanner } from "@/types/banner.type";
import { useUpdateBannerMutation } from "@/redux/Api/bannerApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const bannerSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  image: z.string().optional(),
  video: z.string().optional(),
  link: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "" || z.string().url().safeParse(val).success,
      "Please enter a valid URL"
    ),
  type: z.enum(["IMAGE", "VIDEO"]),
  isActive: z.boolean(),
}).refine(
  (data) => {
    if (data.type === "IMAGE") {
      return !!data.image;
    }
    if (data.type === "VIDEO") {
      return !!data.video;
    }
    return false;
  },
  {
    message: "Please provide media content based on selected type",
    path: ["type"],
  }
);

export type BannerFormValues = z.infer<typeof bannerSchema>;

interface UpdateBannerProps {
  bannerData: IBanner;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UpdateBanner = ({
  bannerData,
  open,
  onOpenChange,
}: UpdateBannerProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [hasMediaChanged, setHasMediaChanged] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [updateBanner, { isLoading: isUpload }] = useUpdateBannerMutation();

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      image: "",
      video: "",
      link: "",
      type: "IMAGE",
      isActive: true,
    },
  });

  const bannerType = form.watch("type");

  useEffect(() => {
    if (open && bannerData) {
      form.reset({
        title: bannerData.title || "",
        subtitle: bannerData.subtitle || "",
        image: bannerData.image || "",
        video: bannerData.video || "",
        link: bannerData.link || "",
        type: bannerData.type || "IMAGE",
        isActive: bannerData.isActive ?? true,
      });

      // Set preview based on type
      if (bannerData.type === "IMAGE" && bannerData.image) {
        setMediaPreview(bannerData.image);
      } else if (bannerData.type === "VIDEO" && bannerData.video) {
        setMediaPreview(bannerData.video);
      }

      setSelectedFile(null);
      setHasMediaChanged(false);
    }
  }, [open, bannerData, form]);

  const handleSubmit = async (data: BannerFormValues) => {
    setIsSubmitting(true);
    setIsUploading(true);

    const toastId = toast.loading("Updating banner...");

    try {
      // Upload new file if selected
      if (selectedFile && hasMediaChanged) {
        const uploadedUrls = await fileUpload([selectedFile], "banner");
        if (data.type === "IMAGE") {
          data.image = uploadedUrls[0];
          data.video = undefined;
        } else {
          data.video = uploadedUrls[0];
          data.image = undefined;
        }
      }

      // Clean up payload
      const payload: any = {
        type: data.type,
        isActive: data.isActive,
      };

      if (data.title) payload.title = data.title;
      if (data.subtitle) payload.subtitle = data.subtitle;
      if (data.link) payload.link = data.link;
      if (data.type === "IMAGE" && data.image) payload.image = data.image;
      if (data.type === "VIDEO" && data.video) payload.video = data.video;

      const response = await updateBanner({
        id: bannerData.id!,
        data: payload,
      }).unwrap();

      if (response?.statusCode === 200 || response?.success === true) {
        onOpenChange(false);
        form.reset();
        setMediaPreview("");
        setSelectedFile(null);
        setHasMediaChanged(false);
        toast.success(response?.message || "Banner updated successfully", {
          id: toastId,
          duration: 2000,
        });
      }
    } catch (error: any) {
      console.error("Error updating banner:", error);
      toast.error(
        error?.data?.message || error?.message || "Failed to update banner",
        {
          id: toastId,
          duration: 2000,
        }
      );
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const handleFileUpload = useCallback(
    (file: File) => {
      const currentType = form.getValues("type");

      // Validate file type
      if (currentType === "IMAGE" && !file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file");
        return;
      }

      if (currentType === "VIDEO" && !file.type.startsWith("video/")) {
        toast.error("Please upload a valid video file");
        return;
      }

      const maxSize = currentType === "VIDEO" ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(
          `File size must be less than ${currentType === "VIDEO" ? "50MB" : "5MB"}`
        );
        return;
      }

      setSelectedFile(file);
      setHasMediaChanged(true);

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (currentType === "IMAGE") {
          form.setValue("image", base64String);
        } else {
          form.setValue("video", base64String);
        }
        setMediaPreview(base64String);
        form.clearErrors("type");
      };
      reader.onerror = () => {
        toast.error("Failed to read file");
      };
      reader.readAsDataURL(file);
    },
    [form]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileUpload(file);
      }
    },
    [handleFileUpload]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileUpload(file);
      }
      e.target.value = "";
    },
    [handleFileUpload]
  );

  const handleRemoveMedia = useCallback(() => {
    const currentType = form.getValues("type");
    if (currentType === "IMAGE") {
      form.setValue("image", "");
    } else {
      form.setValue("video", "");
    }
    setMediaPreview("");
    setSelectedFile(null);
    setHasMediaChanged(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [form]);

  const handleClickUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleTypeChange = useCallback((value: "IMAGE" | "VIDEO") => {
    const currentData = form.getValues();
    form.setValue("type", value);

    // Clear opposite media field when switching types
    if (value === "IMAGE") {
      form.setValue("video", "");
      if (currentData.image) {
        setMediaPreview(currentData.image);
      } else {
        setMediaPreview("");
      }
    } else {
      form.setValue("image", "");
      if (currentData.video) {
        setMediaPreview(currentData.video);
      } else {
        setMediaPreview("");
      }
    }

    setSelectedFile(null);
    setHasMediaChanged(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl shadow-none border-0 dark:bg-[#1F1F1F]">
        <ScrollArea className="max-h-[80vh] pr-4">
          <DialogHeader>
            <DialogTitle>Update Banner</DialogTitle>
            <DialogDescription>
              Update the banner details. You can change the media by uploading a new file.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <div className="space-y-6 mt-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Banner Type <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={handleTypeChange}
                      value={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select banner type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="IMAGE">
                          <div className="flex items-center">
                            <Image className="mr-2 h-4 w-4" />
                            Image Banner
                          </div>
                        </SelectItem>
                        <SelectItem value="VIDEO">
                          <div className="flex items-center">
                            <Video className="mr-2 h-4 w-4" />
                            Video Banner
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose whether to use an image or video
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={bannerType === "IMAGE" ? "image" : "video"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {bannerType === "IMAGE" ? "Banner Image" : "Banner Video"}{" "}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept={bannerType === "IMAGE" ? "image/*" : "video/*"}
                          onChange={handleFileInputChange}
                          className="hidden"
                          disabled={isSubmitting}
                        />

                        {mediaPreview ? (
                          <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
                            {bannerType === "IMAGE" ? (
                              <img
                                src={mediaPreview}
                                alt="Banner preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <video
                                src={mediaPreview}
                                controls
                                className="w-full h-full object-cover"
                              />
                            )}
                            {!isSubmitting && (
                              <div className="absolute top-2 right-2 flex gap-2">
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="icon"
                                  onClick={handleClickUpload}
                                  title="Change media"
                                >
                                  <Upload className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  onClick={handleRemoveMedia}
                                  title="Remove media"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                            {isUploading && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <div className="text-white text-center">
                                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                                  <p className="text-sm">Uploading...</p>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={handleClickUpload}
                            className={`
                            relative aspect-video rounded-lg border-2 border-dashed
                            transition-colors cursor-pointer
                            ${isDragging
                                ? "border-primary bg-primary/5"
                                : "border-muted-foreground/25 hover:border-primary/50"
                              }
                            ${isSubmitting
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                              }
                          `}
                          >
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground pointer-events-none">
                              {bannerType === "IMAGE" ? (
                                <Image className="h-8 w-8" />
                              ) : (
                                <Video className="h-8 w-8" />
                              )}
                              <div className="text-center">
                                <p className="text-sm font-medium">
                                  Drop your {bannerType.toLowerCase()} here or click to browse
                                </p>
                                <p className="text-xs">
                                  {bannerType === "IMAGE"
                                    ? "Supports: JPG, PNG, GIF, WebP (Max 5MB)"
                                    : "Supports: MP4, WebM, OGG (Max 50MB)"}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter banner title"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtitle (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter banner subtitle"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/page"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Enable or disable this banner from being displayed
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={isSubmitting || isUpload}
                  onClick={form.handleSubmit(handleSubmit)}
                >
                  {(isSubmitting || isUpload) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isUploading || isUpload ? "Uploading..." : "Update Banner"}
                </Button>
              </DialogFooter>
            </div>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateBanner;