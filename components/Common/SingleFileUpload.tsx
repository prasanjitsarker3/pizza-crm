"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Upload, X, ImageIcon } from "lucide-react";

interface SingleFileUploadProps {
  file: File | null;
  setFile: (file: File | null) => void;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  required?: boolean;
  label?: string;
  placeholder?: string;
  className?: string;
  onError?: (error: string) => void;
}

const SingleFileUpload: React.FC<SingleFileUploadProps> = ({
  file,
  setFile,
  maxSize = 5,
  acceptedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
  required = false,
  label = "Image Upload",
  placeholder = "Click to upload image",
  className,
  onError,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    onError?.(errorMessage);
  };

  const clearError = () => {
    setError(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    clearError();

    // Validate file type
    if (!acceptedTypes.some((type) => selectedFile.type === type)) {
      handleError("Please upload a valid image file (JPEG, PNG, GIF, WebP)");
      return;
    }

    // Validate file size
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (selectedFile.size > maxSizeBytes) {
      handleError(`Image size should be less than ${maxSize}MB`);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);

    setFile(selectedFile);
  };

  const clearImage = () => {
    setFile(null);
    setImagePreview(null);
    clearError();
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  // Update preview when file prop changes externally
  React.useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }, [file]);

  const acceptString = acceptedTypes.join(",");
  const maxSizeText = `up to ${maxSize}MB`;
  const fileTypesText = acceptedTypes
    .map((type) => type.split("/")[1].toUpperCase())
    .join(", ");

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="flex items-center gap-2 text-sm font-medium">
          <ImageIcon className="h-4 w-4" />
          {label}
          {required && <span className="text-destructive">*</span>}
        </label>
      )}

      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors",
          error ? "border-destructive bg-destructive/5" : "border-gray-300",
          "min-h-[120px]"
        )}
        onClick={() => imageInputRef.current?.click()}
      >
        <input
          type="file"
          ref={imageInputRef}
          accept={acceptString}
          onChange={handleImageUpload}
          className="hidden"
        />

        {!imagePreview ? (
          <>
            <Upload className="h-8 w-8 text-gray-400" />
            <div className="text-center">
              <p className="text-sm text-gray-600 font-medium">{placeholder}</p>
              <p className="text-xs text-gray-400 mt-1">
                {fileTypesText} {maxSizeText}
              </p>
            </div>
          </>
        ) : (
          <div className="relative w-full max-w-xs">
            <img
              src={imagePreview || "/placeholder.svg"}
              alt="Preview"
              className="max-h-32 w-full mx-auto rounded-md object-contain"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                clearImage();
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-destructive mt-1">{error}</p>}

      {file && !error && (
        <div className="text-xs text-gray-500 mt-1">
          Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
        </div>
      )}
    </div>
  );
};

export default SingleFileUpload;
