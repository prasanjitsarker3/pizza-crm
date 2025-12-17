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
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar as CalendarIcon,
  Camera,
  Eye,
  EyeOff,
  Upload,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { fileUpload } from "@/actions/file";
import { useCreateUserMutation } from "@/redux/Api/userApi";

// User Schema
const userSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  profileImage: z.string().optional(),
  dateOfBirth: z.date().optional(),
  gender: z.enum(["Male", "Female"]).optional(),
  role: z.enum(["USER", "ADMIN", "VENDOR"]),
  address: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  isVerified: z.boolean(),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserFormProps {
  userData?: Partial<UserFormValues>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit?: boolean;
}

const UserCreateModal = ({
  userData,
  open,
  onOpenChange,
  isEdit = false,
}: UserFormProps) => {
  const [see, setSee] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [createUser, { isLoading }] = useCreateUserMutation();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      profileImage: "",
      dateOfBirth: undefined,
      gender: undefined,
      role: "USER",
      address: "",
      bio: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      isVerified: false,
    },
  });

  useEffect(() => {
    if (userData && open) {
      form.reset({
        ...userData,
        dateOfBirth: userData.dateOfBirth
          ? new Date(userData.dateOfBirth)
          : undefined,
      });
      if (userData.profileImage) {
        setImagePreview(userData.profileImage);
      }
    } else if (!open) {
      form.reset();
      setImagePreview("");
      setImageFile(null);
    }
  }, [userData, open, form]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        form.setValue("profileImage", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview("");
    setImageFile(null);
    form.setValue("profileImage", "");
  };

  const onSubmit = async (data: UserFormValues) => {
    const toastId = toast.loading("Creating user...");

    try {
      if (imageFile) {
        try {
          const uploadedUrls = await fileUpload([imageFile], "course");
          data.profileImage = uploadedUrls[0];
        } catch (error: any) {
          toast.error(
            error?.message || error?.data?.message || "Failed to upload image!",
            {
              id: toastId,
              duration: 3000,
            }
          );
          return;
        }
      } else {
        toast.info("No profile image selected, creating user without image.", {
          id: toastId,
          duration: 2000,
        });
      }
      try {
        const response = await createUser(data).unwrap();
        console.log("Response check", response);
        if (response?.statusCode === 201) {
          toast.success(response?.message || "User created successfully!", {
            id: toastId,
            duration: 3000,
          });
          handleClose();
        } else {
          toast.error(response?.message || "Failed to create user!", {
            id: toastId,
            duration: 3000,
          });
        }
      } catch (error: any) {
        toast.error(
          error?.data?.message || error?.message || "Failed to create user!",
          {
            id: toastId,
            duration: 3000,
          }
        );
      }
    } catch (error: any) {
      toast.error(
        error?.message || error?.data?.message || "Something went wrong!",
        {
          id: toastId,
          duration: 3000,
        }
      );
      console.error("Submission error:", error);
    }
  };
  const handleClose = () => {
    onOpenChange(false);
    form.reset();
    setImagePreview("");
    setImageFile(null);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] dark:bg-[#1F1F1F] border-0 shadow-none max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Update User" : "Create User"}</DialogTitle>
          <DialogDescription className="sr-only">
            {isEdit ? "Update user details" : "Create a new user account"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <div className="space-y-4">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center gap-4 pb-4 border p-2  rounded-lg">
              <Avatar className="h-24 w-24 bg-white !important">
                <AvatarImage src={imagePreview} alt="Profile" />
                <AvatarFallback className="text-2xl">
                  {form.watch("name") ? getInitials(form.watch("name")) : "UN"}
                </AvatarFallback>
              </Avatar>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className=" hover:bg-primary hover:text-white cursor-pointer"
                  onClick={() =>
                    document.getElementById("profileImage")?.click()
                  }
                >
                  <Camera className="h-4 w-4" />
                </Button>
                {imagePreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className=" hover:bg-primary hover:text-white cursor-pointer"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <input
                id="profileImage"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <p className="text-xs bg-red-50 text-red-500 p-1 rounded-md">
                ! Square image, at least 200x200px (Max 5MB)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name <span className=" text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        className=" py-5"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <span className=" text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                        className=" py-5"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0134567890"
                        {...field}
                        className=" py-5"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              {!isEdit && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Password <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={see ? "text" : "password"}
                            placeholder="••••••"
                            {...field}
                            className="py-5 pr-12"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200  rounded-md p-1"
                            onClick={() => setSee(!see)}
                          >
                            {see ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Gender */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className=" py-5 w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Role <span className=" text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className=" py-5 w-full">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USER">User</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="VENDOR">Vendor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date of Birth */}
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birth Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full pl-3 text-left font-normal py-5"
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span className="text-muted-foreground">
                                Pick a date
                              </span>
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
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Bio */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123 Main St"
                      {...field}
                      className=" py-5"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* City */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="New York"
                        {...field}
                        className=" py-5"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* State */}
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="NY" {...field} className=" py-5" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Country */}
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="United States"
                        {...field}
                        className=" py-5"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Postal Code */}
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder="10001" {...field} className=" py-5" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Is Verified */}
            <FormField
              control={form.control}
              name="isVerified"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Verified Account
                    </FormLabel>
                    <FormDescription>
                      Mark this account as verified
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="button" onClick={form.handleSubmit(onSubmit)} className=" dark:bg-[#ff7200] dark:text-white">
                {isEdit ? "Update User" : "Create User"}
              </Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserCreateModal;
