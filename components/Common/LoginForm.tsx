"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { userLogin } from "@/actions/auth";
import { toast } from "sonner";

interface FormValues {
  email: string;
  password: string;
}

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: FormValues) => {
    const toastId = toast.loading("Login...!");
    setIsLoading(true)
    try {
      const result = await userLogin(data);

      if (result?.statusCode === 200 && result?.data) {
        toast.success(result.message, { id: toastId, duration: 1000 });
        router.push("/admin");
      } else {
        toast.error(result?.message || "Login failed", { id: toastId, duration: 2000 });
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      toast.error(error?.message || "Something went wrong", { id: toastId, duration: 2000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/loginBack.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Login Form Container */}
      <div className="relative z-10 w-full max-w-md px-4 py-8 sm:px-0">
        <div className="backdrop-blur-md bg-white/10 rounded-xl border border-white/20 p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Email Field */}
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-200"
              >
                Email*
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full rounded-md border ${errors.email ? "border-red-400" : "border-gray-500"
                    } bg-white/10 backdrop-blur-sm py-2 px-3 text-white placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 transition-all duration-200`}
                  disabled={isLoading}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-200"
              >
                Password*
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  className={`w-full rounded-md border ${errors.password ? "border-red-400" : "border-gray-500"
                    } bg-white/10 backdrop-blur-sm py-2 px-3 text-white placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 transition-all duration-200`}
                  disabled={isLoading}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="w-full rounded-md border py-2 px-4 font-medium text-white cursor-pointer  focus:outline-none focus:ring-2  focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
