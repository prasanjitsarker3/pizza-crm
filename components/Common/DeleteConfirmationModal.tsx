"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";

interface DeleteConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isLoading?: boolean;
}

export const DeleteConfirmationModal = ({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmButtonText = "Delete",
  cancelButtonText = "Cancel",
  isLoading = false,
}: DeleteConfirmationModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[350px] mx-auto rounded-lg text-center">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold sr-only">
            {title}
          </AlertDialogTitle>
          <div className=" w-12 h-12 p-1 flex justify-center items-center mx-auto bg-red-100 text-red-500 rounded-full">
            <Trash />
          </div>
          <AlertDialogDescription className="text-sm text-gray-600 text-center">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row justify-end space-x-3">
          <AlertDialogCancel disabled={isLoading} className="mt-0  border-0">
            {cancelButtonText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90 px-4"
          >
            {isLoading ? "Processing..." : confirmButtonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
