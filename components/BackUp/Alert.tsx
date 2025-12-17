import React from "react";
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
import { Button } from "@/components/ui/button";
import { Trash2, Check, X, Eye, EyeOff, Archive } from "lucide-react";

type ActionType =
  | "delete"
  | "publish"
  | "unpublish"
  | "archive"
  | "restore"
  | "custom";

interface ConfirmationAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionType?: ActionType;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  itemName?: string;
  isLoading?: boolean;
}

const ConfirmationAlert: React.FC<ConfirmationAlertProps> = ({
  isOpen,
  onClose,
  onConfirm,
  actionType = "delete",
  title,
  description,
  confirmText,
  cancelText = "Cancel",
  itemName,
  isLoading = false,
}) => {
  // Get default configurations based on action type
  const getActionConfig = () => {
    switch (actionType) {
      case "delete":
        return {
          title: title || "Delete Item",
          description:
            description ||
            `Are you sure you want to delete ${
              itemName || "this item"
            }? This action cannot be undone.`,
          confirmText: confirmText || "Delete",
          confirmClass: "bg-red-600 hover:bg-red-700 dark:text-white",
          icon: <Trash2 className="h-4 w-4" />,
        };
      case "publish":
        return {
          title: title || "Publish Item",
          description:
            description ||
            `Are you sure you want to publish ${
              itemName || "this item"
            }? It will be visible to users.`,
          confirmText: confirmText || "Publish",
          confirmClass: "bg-green-600 hover:bg-green-700 dark:text-white",
          icon: <Check className="h-4 w-4" />,
        };
      case "unpublish":
        return {
          title: title || "Unpublish Item",
          description:
            description ||
            `Are you sure you want to unpublish ${
              itemName || "this item"
            }? It will be hidden from users.`,
          confirmText: confirmText || "Unpublish",
          confirmClass: "bg-orange-600 hover:bg-orange-700 dark:text-white",
          icon: <EyeOff className="h-4 w-4" />,
        };
      case "archive":
        return {
          title: title || "Archive Item",
          description:
            description ||
            `Are you sure you want to archive ${itemName || "this item"}?`,
          confirmText: confirmText || "Archive",
          confirmClass: "bg-gray-600 hover:bg-gray-700",
          icon: <Archive className="h-4 w-4" />,
        };
      case "restore":
        return {
          title: title || "Restore Item",
          description:
            description ||
            `Are you sure you want to restore ${itemName || "this item"}?`,
          confirmText: confirmText || "Restore",
          confirmClass: "bg-blue-600 hover:bg-blue-700",
          icon: <Check className="h-4 w-4" />,
        };
      default:
        return {
          title: title || "Confirm Action",
          description: description || "Are you sure you want to proceed?",
          confirmText: confirmText || "Confirm",
          confirmClass: "bg-blue-600 hover:bg-blue-700",
          icon: <Check className="h-4 w-4" />,
        };
    }
  };

  const config = getActionConfig();

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <AlertDialogContent className=" dark:bg-[#1F1F1F]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {config.icon}
            {config.title}
          </AlertDialogTitle>
          <AlertDialogDescription>{config.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={config.confirmClass}
          >
            {isLoading ? "Processing..." : config.confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationAlert;
