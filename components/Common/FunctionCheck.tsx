"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SingleFileUpload from "./SingleFileUpload";

export default function UploadFileCheck() {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [productImage, setProductImage] = useState<File | null>(null);

  const handleError = (error: string) => {
    console.error("Upload error:", error);
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Reusable Image Upload Demo</h1>

      <div className="space-y-6">
        <SingleFileUpload
          file={profileImage}
          setFile={setProfileImage}
          label="Profile Picture"
          placeholder="Upload your profile picture"
          maxSize={2}
          required
          onError={handleError}
        />
      </div>
    </div>
  );
}
