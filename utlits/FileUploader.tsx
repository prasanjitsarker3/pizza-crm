"use client"
import React, { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Upload, X, ImageIcon, FileIcon } from "lucide-react"

interface SingleFileUploaderProps {
  file: File | null
  setFile: (file: File | null) => void
  title: string
  required?: boolean
  maxSizeInMB?: number
  acceptedFileTypes?: string[]
  className?: string
  onFileSelect?: (file: File) => void
  onFileRemove?: () => void
  onValidationError?: (error: string) => void
  showPreview?: boolean
  previewClassName?: string
  existingFileUrl?: string | null
  onExistingFileRemove?: () => void
  error?: string
}

const SingleFileUploader: React.FC<SingleFileUploaderProps> = ({
  file,
  setFile,
  title,
  required = false,
  maxSizeInMB = 5,
  acceptedFileTypes = ["image/*"],
  className,
  onFileSelect,
  onFileRemove,
  onValidationError,
  showPreview = true,
  previewClassName,
  existingFileUrl,
  onExistingFileRemove,
  error,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isImageUrl = (url: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
  const [imagePreview, setImagePreview] = React.useState<string | null>(
    existingFileUrl && showPreview && isImageUrl(existingFileUrl) ? existingFileUrl : null,
  )

  const [hasExistingFile, setHasExistingFile] = React.useState<boolean>(!!existingFileUrl)
  

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    const isValidType = acceptedFileTypes.some((type) => {
      if (type === "image/*") {
        return selectedFile.type.startsWith("image/")
      }
      return selectedFile.type === type || selectedFile.type.includes(type.replace("/*", ""))
    })

    if (!isValidType) {
      const errorMsg = `Please upload a valid file type. Accepted: ${acceptedFileTypes.join(", ")}`
      onValidationError?.(errorMsg)
      return
    }

    if (selectedFile.size > maxSizeInMB * 1024 * 1024) {
      const errorMsg = `File size should be less than ${maxSizeInMB}MB`
      onValidationError?.(errorMsg)
      return
    }

    if (selectedFile.type.startsWith("image/") && showPreview) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setImagePreview(null)
    }

    setFile(selectedFile)
    setHasExistingFile(false)
    onFileSelect?.(selectedFile)
  }

  const clearFile = () => {
    setFile(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onFileRemove?.()
  }

  const clearExistingFile = () => {
    setHasExistingFile(false)
    onExistingFileRemove?.()
  }

  const getFileTypeText = () => {
    const types = acceptedFileTypes
      .map((type) => {
        if (type === "image/*") return "Images"
        if (type === "application/pdf") return "PDF"
        if (type === "application/msword") return "Word"
        return type.split("/")[1]?.toUpperCase() || type
      })
      .join(", ")
    return `${types} up to ${maxSizeInMB}MB`
  }

  const isImageFile = (file: File) => file.type.startsWith("image/")
  // const isImageUrl = (url: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);

  useEffect(() => {
    if (existingFileUrl && !file) {
      setHasExistingFile(true)
      if (isImageUrl(existingFileUrl) && showPreview) {
        setImagePreview(existingFileUrl)
      }
    }
  }, [existingFileUrl, file, showPreview])
  useEffect(() => {
    if (file && isImageFile(file) && showPreview && !imagePreview) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [file, showPreview, imagePreview])

  const hasAnyFile = file || hasExistingFile
  const displayPreview = imagePreview && showPreview
  const hasError = !!error

  return (
    <div className={className}>
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          {acceptedFileTypes.includes("image/*") ? <ImageIcon className="h-4 w-4" /> : <FileIcon className="h-4 w-4" />}
          {title}
          {required && <span className="text-red-500">*</span>}
          {hasAnyFile && <span className="text-green-600 text-sm font-normal">✓ {file ? "New file" : "Existing"}</span>}
        </Label>
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors flex-grow",
              hasError ? "border-red-500 bg-red-50" : hasAnyFile ? "border-green-300 bg-green-50" : "border-gray-300",
            )}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept={acceptedFileTypes.join(",")}
              onChange={handleFileUpload}
              className="hidden"
            />
            {!hasAnyFile ? (
              <>
                <Upload className="h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-500">Click to upload {title.toLowerCase()}</p>
                <p className="text-xs text-gray-400">{getFileTypeText()}</p>
              </>
            ) : (
              <div className="relative w-full">
                {displayPreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview || "/placeholder.svg?height=128&width=200"}
                      alt="Preview"
                      className={cn("max-h-32 mx-auto rounded-md object-contain", previewClassName)}
                    />
                    {file && (
                      <div className="absolute bottom-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        New Upload
                      </div>
                    )}
                    {hasExistingFile && !file && (
                      <div className="absolute bottom-0 left-0 bg-gray-500 text-white text-xs px-2 py-1 rounded">
                        Current
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 p-2 bg-white rounded-md border">
                    <FileIcon className="h-5 w-5 text-blue-500" />
                    <span className="text-sm text-gray-700 truncate max-w-[200px]">
                      {file ? file.name : "Existing file"}
                    </span>
                    {file && <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>}
                  </div>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (file) {
                      clearFile()
                    } else if (hasExistingFile) {
                      clearExistingFile()
                    }
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
        {hasError && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  )
}

export default SingleFileUploader
