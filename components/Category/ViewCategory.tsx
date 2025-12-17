"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { formatDate } from "@/utlits/formatDate";
import { Calendar, Hash, FileText, Package } from "lucide-react";

interface ICategoryData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
  totalProducts?: number;
  createdAt: string;
  updatedAt?: string;
}

interface ViewCategoryProps {
  categoryData: ICategoryData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewCategory = ({ categoryData, open, onOpenChange }: ViewCategoryProps) => {
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] shadow-none border-0 dark:bg-[#1F1F1F]">
        <ScrollArea className="max-h-[85vh] pr-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              View Category
              <Badge
                variant={categoryData.isActive ? "default" : "secondary"}
                className={
                  categoryData.isActive
                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                    : ""
                }
              >
                {categoryData.isActive ? "Active" : "Inactive"}
              </Badge>
            </DialogTitle>
            <DialogDescription className="sr-only">
              Category details and information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid gap-5">
              {/* Name */}
              <div className="space-y-2 p-4 rounded-lg bg-muted/30 border border-border">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Category Name
                </span>
                <p className="text-base font-semibold text-foreground">
                  {categoryData.name}
                </p>
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Slug
                </span>
                <p className="text-base text-foreground font-mono bg-muted/50 px-3 py-2 rounded-md border">
                  {categoryData.slug}
                </p>
              </div>

              {/* Description */}
              {categoryData.description && (
                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Description
                  </span>
                  <p className="text-base text-foreground leading-relaxed bg-muted/30 p-3 rounded-md border">
                    {categoryData.description}
                  </p>
                </div>
              )}

              {/* Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Status
                  </span>
                  <div>
                    <Badge
                      variant={categoryData.isActive ? "default" : "secondary"}
                      className={`${categoryData.isActive
                          ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-muted text-muted-foreground"
                        }`}
                    >
                      {categoryData.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                {/* Total Products */}
                {categoryData.totalProducts !== undefined && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Total Products
                    </span>
                    <p className="text-2xl font-bold text-foreground">
                      {categoryData.totalProducts}
                    </p>
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Created At
                  </span>
                  <p className="text-sm text-foreground">
                    {formatDate(categoryData.createdAt)}
                  </p>
                </div>

                {categoryData.updatedAt &&
                  categoryData.updatedAt !== categoryData.createdAt && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Last Updated
                      </span>
                      <p className="text-sm text-foreground">
                        {formatDate(categoryData.updatedAt)}
                      </p>
                    </div>
                  )}
              </div>

              {/* Category ID */}
              <div className="space-y-2 pt-2 border-t">
                <span className="text-xs font-medium text-muted-foreground">
                  Category ID
                </span>
                <p className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded">
                  {categoryData.id}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Close
            </Button>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCategory;