"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Gift,
  Percent,
  DollarSign,
  Ticket,
  Plus,
  Upload,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useCreateGiftCardCouponMutation } from "@/redux/Api/couponApi";
import { cn } from "@/lib/utils";
import { fileUpload } from "@/actions/file";

// Enum for Gift Key Type
enum GiftKeyType {
  POINTS = "POINTS",
  PERCENT_OFF = "PERCENT_OFF",
  AMOUNT_OFF = "AMOUNT_OFF",
  COUPON = "COUPON",
}

// Zod Schema matching backend DTO
const giftCardSchema = z
  .object({
    code: z.string().min(1, "Code is required"),
    type: z.nativeEnum(GiftKeyType, {
      required_error: "Please select a gift card type",
    }),
    pointsValue: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val ||
          (!isNaN(Number(val)) &&
            Number(val) > 0 &&
            Number.isInteger(Number(val))),
        "Points value must be a positive integer"
      ),
    amountValue: z
      .string()
      .optional()
      .refine(
        (val) => !val || (!isNaN(Number(val)) && Number(val) > 0),
        "Amount value must be a positive number"
      ),
    percentValue: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val ||
          (!isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100),
        "Percent value must be between 0 and 100"
      ),
    maxRedemptions: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val ||
          (!isNaN(Number(val)) &&
            Number(val) > 0 &&
            Number.isInteger(Number(val))),
        "Max redemptions must be a positive integer"
      ),
    expiresAt: z.date().optional(),
    img: z.any().optional(),
    meta: z
      .array(
        z.object({
          key: z.string(),
          value: z.string(),
        })
      )
      .optional(),
  })
  .refine(
    (data) => {
      // Validate that required value fields are filled based on type
      if (data.type === GiftKeyType.POINTS) {
        return data.pointsValue && Number(data.pointsValue) > 0;
      }
      if (data.type === GiftKeyType.PERCENT_OFF) {
        return data.percentValue && Number(data.percentValue) > 0;
      }
      if (data.type === GiftKeyType.AMOUNT_OFF) {
        return data.amountValue && Number(data.amountValue) > 0;
      }
      return true;
    },
    {
      message: "Please provide the required value for the selected type",
      path: ["type"],
    }
  );

type GiftCardFormValues = z.infer<typeof giftCardSchema>;

export default function CouponCreate() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [imagePreview, setImagePreview] = useState<string>("");
  const [metaFields, setMetaFields] = useState<
    Array<{ key: string; value: string }>
  >([]);

  const [createCoupon] = useCreateGiftCardCouponMutation();

  const form = useForm<GiftCardFormValues>({
    resolver: zodResolver(giftCardSchema),
    defaultValues: {
      code: "",
      type: GiftKeyType.COUPON,
      pointsValue: "",
      amountValue: "",
      percentValue: "",
      maxRedemptions: "1",
      expiresAt: undefined,
      img: undefined,
      meta: [],
    },
  });

  const selectedType = form.watch("type");

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      form.setValue("img", file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    form.setValue("img", undefined);
    setImagePreview("");
  };

  // Handle meta fields
  const addMetaField = () => {
    setMetaFields([...metaFields, { key: "", value: "" }]);
  };

  const updateMetaField = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const updated = [...metaFields];
    updated[index][field] = value;
    setMetaFields(updated);
    form.setValue("meta", updated);
  };

  const removeMetaField = (index: number) => {
    const updated = metaFields.filter((_, i) => i !== index);
    setMetaFields(updated);
    form.setValue("meta", updated);
  };

  const onSubmit = async (data: GiftCardFormValues) => {
    const toastId = toast.loading("Creating gift card...");
    setIsLoading(true);

    try {
      // Convert string values to numbers where applicable
      const formattedData = {
        ...data,
        pointsValue: data.pointsValue ? Number(data.pointsValue) : undefined,
        amountValue: data.amountValue ? Number(data.amountValue) : undefined,
        percentValue: data.percentValue ? Number(data.percentValue) : undefined,
        maxRedemptions: data.maxRedemptions
          ? Number(data.maxRedemptions)
          : undefined,
      };

      // Handle image upload
      if (formattedData.img && formattedData.img instanceof File) {
        try {
          const uploadedUrls = await fileUpload(
            [formattedData.img],
            "coupon"
          );
          formattedData.img = uploadedUrls[0];
        } catch (error: any) {
          toast.error(
            error?.message ||
              error?.data?.message ||
              "Failed to upload banner image!",
            {
              id: toastId,
              duration: 3000,
            }
          );
          return;
        }
      }

      const response = await createCoupon(formattedData).unwrap();
      console.log("response is", response);

      if (response?.statusCode === 201) {
        setOpen(false);
        form.reset();
        setImagePreview("");
        setMetaFields([]);
        toast.success(response?.message || "Gift card created successfully", {
          id: toastId,
          duration: 1000,
        });
      } else {
        toast.error("Failed to create gift card", {
          id: toastId,
          duration: 1000,
        });
      }
    } catch (error: any) {
      console.log("error", error);
      toast.error(
        error?.data?.message || error?.message || "Something went wrong!",
        { id: toastId }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      form.reset();
      setImagePreview("");
      setMetaFields([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Gift Card
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] border-0 shadow-none max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Gift className="h-6 w-6 text-primary" />
            Create Gift Card / Coupon
          </DialogTitle>
          <DialogDescription className="sr-only">
            Create a new gift card or coupon for your customers to redeem
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Code */}
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Code <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="SUMMER2025"
                        {...field}
                        className="py-5"
                      />
                    </FormControl>
                    {/* <FormDescription>Unique coupon code</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gift Card Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Type <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="py-5 w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={GiftKeyType.POINTS}>
                          <div className="flex items-center gap-2">
                            <Gift className="h-4 w-4" />
                            Points
                          </div>
                        </SelectItem>
                        <SelectItem value={GiftKeyType.PERCENT_OFF}>
                          <div className="flex items-center gap-2">
                            <Percent className="h-4 w-4" />
                            Percent Off
                          </div>
                        </SelectItem>
                        <SelectItem value={GiftKeyType.AMOUNT_OFF}>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Amount Off
                          </div>
                        </SelectItem>
                        <SelectItem value={GiftKeyType.COUPON}>
                          <div className="flex items-center gap-2">
                            <Ticket className="h-4 w-4" />
                            Coupon
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {/* <FormDescription>Select coupon type</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Points Value */}
              <FormField
                control={form.control}
                name="pointsValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Points Value
                      {selectedType === GiftKeyType.POINTS && (
                        <span className="text-red-500">*</span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="100"
                        {...field}
                        className="py-5"
                      />
                    </FormControl>
                    {/* <FormDescription>For POINTS type</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Amount Value */}
              <FormField
                control={form.control}
                name="amountValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Amount Value (Taka)
                      {selectedType === GiftKeyType.AMOUNT_OFF && (
                        <span className="text-red-500">*</span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="500"
                        {...field}
                        className="py-5"
                      />
                    </FormControl>
                    {/* <FormDescription>For AMOUNT_OFF type</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Percent Value */}
              <FormField
                control={form.control}
                name="percentValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Percent Value
                      {selectedType === GiftKeyType.PERCENT_OFF && (
                        <span className="text-red-500">*</span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="10"
                        min="0"
                        max="100"
                        {...field}
                        className="py-5"
                      />
                    </FormControl>
                    {/* <FormDescription>For PERCENT_OFF (0-100%)</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Max Redemptions */}
              <FormField
                control={form.control}
                name="maxRedemptions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Redemptions</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1"
                        {...field}
                        className="py-5"
                      />
                    </FormControl>
                    {/* <FormDescription>Usage limit (default: 1)</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Expires At with Calendar */}
              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Expires At</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full py-5 pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {/* <FormDescription>Optional expiry date</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Image Upload */}
            <FormField
              control={form.control}
              name="img"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Gift Card Image</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {!imagePreview ? (
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:bg-background">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-2 text-gray-500" />
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, GIF up to 5MB
                              </p>
                            </div>
                            <Input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleImageChange}
                              {...field}
                            />
                          </label>
                        </div>
                      ) : (
                        <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={removeImage}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  {/* <FormDescription>
                    Upload an image for the gift card
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Meta Fields */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FormLabel>Meta Information (Optional)</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addMetaField}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Field
                </Button>
              </div>

              {metaFields.map((field, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Key (e.g., campaign)"
                    value={field.key}
                    onChange={(e) =>
                      updateMetaField(index, "key", e.target.value)
                    }
                    className="py-5"
                  />
                  <Input
                    placeholder="Value (e.g., New Year Offer)"
                    value={field.value}
                    onChange={(e) =>
                      updateMetaField(index, "value", e.target.value)
                    }
                    className="py-5"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMetaField(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {metaFields.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Add custom metadata like campaign name, notes, etc.
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="mt-6">
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
              onClick={() => form.handleSubmit(onSubmit)()}
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Gift Card"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
