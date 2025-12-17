

"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultipleFileUploaderProps {
  file: File[];
  setFile: (files: File[]) => void;
  maxSizeInMB?: number;
  acceptedFileTypes?: string[];
  required?: boolean;
  title?: string;
  placeholder?: string;
  className?: string;
  previewClassName?: string;
  onError?: (error: string) => void;
  showPreview?: boolean;
  existingImages?: string[]; // Add this prop for existing image URLs
  onRemoveExistingImage?: (index: number) => void; // Add this callback
}

const MultipleFileUploader: React.FC<MultipleFileUploaderProps> = ({
  file,
  setFile,
  maxSizeInMB = 10,
  acceptedFileTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
  required = false,
  title = "Upload Images",
  placeholder = "Click to upload images",
  className,
  previewClassName = "",
  onError,
  showPreview = true,
  existingImages = [], // Default empty array
  onRemoveExistingImage, // Optional callback
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const maxBytes = maxSizeInMB * 1024 * 1024;
  const acceptString = acceptedFileTypes.join(",");

  const clearError = () => setError(null);
  const handleError = (msg: string) => {
    setError(msg);
    onError?.(msg);
  };

  const readAsDataURL = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const generatePreviews = async (files: File[]) => {
    try {
      const urls = await Promise.all(files.map(readAsDataURL));
      setPreviews((prev) => [...prev, ...urls]);
    } catch (err) {
      console.error("Failed to generate previews:", err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    clearError();

    const existingSignatures = new Set(file.map((f) => `${f.name}_${f.size}`));
    const validFiles: File[] = [];

    for (const f of selectedFiles) {
      const signature = `${f.name}_${f.size}`;

      const isAcceptedType = acceptedFileTypes.some((type) => {
        if (type === "*/*") return true;
        if (type.endsWith("/*")) return f.type.startsWith(type.split("/")[0]);
        return f.type === type;
      });

      if (!isAcceptedType) return handleError("Unsupported file type.");
      if (f.size > maxBytes)
        return handleError(`File must be under ${maxSizeInMB}MB.`);
      if (!existingSignatures.has(signature)) validFiles.push(f);
    }

    if (validFiles.length > 0) {
      const updatedFiles = [...file, ...validFiles];
      setFile(updatedFiles);
      await generatePreviews(validFiles);
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...file];
    const updatedPreviews = [...previews];
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setFile(updatedFiles);
    setPreviews(updatedPreviews);
  };

  const handleRemoveExisting = (index: number) => {
    if (onRemoveExistingImage) {
      onRemoveExistingImage(index);
    }
  };

  const handleClearAll = () => {
    setFile([]);
    setPreviews([]);
    clearError();
  };

  useEffect(() => {
    if (file.length === 0 && previews.length > 0) {
      setPreviews([]);
    }
  }, [file]);

  const fileTypesText = acceptedFileTypes
    .map((type) => type.split("/")[1]?.toUpperCase() || "FILE")
    .join(", ");
  const maxSizeText = `up to ${maxSizeInMB}MB`;

  // Calculate total items (existing images + new previews)
  const totalItems = (existingImages?.length || 0) + previews.length;

  return (
    <div className={cn("space-y-3", className)}>
      {title && (
        <label className="flex items-center gap-2 text-sm font-medium">
          <ImageIcon className="h-4 w-4" />
          {title}
          {required && <span className="text-destructive">*</span>}
        </label>
      )}

      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors min-h-[120px]",
          error ? "border-destructive bg-destructive/10" : "border-gray-300"
        )}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptString}
          onChange={handleFileUpload}
          className="hidden"
        />
        <Upload className="h-8 w-8 text-gray-400" />
        <div className="text-center">
          <p className="text-sm text-gray-600 font-medium">{placeholder}</p>
          <p className="text-xs text-gray-400 mt-1">
            {fileTypesText} {maxSizeText}
          </p>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {showPreview && totalItems > 0 && (
        <div
          className={cn(
            "grid grid-cols-2 sm:grid-cols-4 gap-3",
            previewClassName
          )}
        >
          {/* Render existing images first */}
          {existingImages?.map((src, index) => (
            <div key={`existing-${index}`} className="relative group">
              <img
                src={src}
                alt={`Existing ${index}`}
                className="w-full h-40 rounded-md border object-cover"
              />
              {onRemoveExistingImage && (
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute top-1 right-1 h-5 w-5 p-0 rounded-full opacity-80 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveExisting(index);
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}

          {/* Render new file previews */}
          {previews.map((src, index) => (
            <div key={`new-${index}`} className="relative group">
              <img
                src={src}
                alt={`Preview ${index}`}
                className="w-full h-40 rounded-md border object-cover"
              />
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute top-1 right-1 h-5 w-5 p-0 rounded-full opacity-80 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile(index);
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {totalItems > 0 && (
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{totalItems} file(s) selected</span>
          <button
            type="button"
            className="text-red-500 bg-red-100 px-2 py-0.5 hover:underline"
            onClick={handleClearAll}
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default MultipleFileUploader;
