"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { IBanner } from "@/types/banner.type";
import { ExternalLink, Image as ImageIcon, Video as VideoIcon, Calendar } from "lucide-react";
import { formatDate } from "@/utlits/formatDate";

interface ViewBannerProps {
  bannerData: IBanner;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewBanner = ({ bannerData, open, onOpenChange }: ViewBannerProps) => {
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl dark:bg-[#1F1F1F]">
        <ScrollArea className="max-h-[85vh] pr-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              View Banner
              <Badge
                variant="outline"
                className={
                  bannerData.type === "IMAGE"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-purple-50 text-purple-700 border-purple-200"
                }
              >
                {bannerData.type === "IMAGE" ? (
                  <ImageIcon className="h-3 w-3 mr-1" />
                ) : (
                  <VideoIcon className="h-3 w-3 mr-1" />
                )}
                {bannerData.type}
              </Badge>
            </DialogTitle>
            <DialogDescription className="sr-only">
              Banner details and information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Banner Media Preview */}
            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">
                Banner {bannerData.type === "IMAGE" ? "Image" : "Video"}
              </span>
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border bg-muted">
                {bannerData.type === "IMAGE" && bannerData.image ? (
                  <img
                    src={bannerData.image}
                    alt={bannerData.title || "Banner image"}
                    className="w-full h-full object-cover"
                  />
                ) : bannerData.type === "VIDEO" && bannerData.video ? (
                  <video
                    src={bannerData.video}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No media available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Banner Details Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                {bannerData.title && (
                  <div className="space-y-1.5">
                    <span className="text-sm font-medium text-muted-foreground">
                      Title
                    </span>
                    <p className="text-base font-semibold text-foreground">
                      {bannerData.title}
                    </p>
                  </div>
                )}

                {bannerData.subtitle && (
                  <div className="space-y-1.5">
                    <span className="text-sm font-medium text-muted-foreground">
                      Subtitle
                    </span>
                    <p className="text-base text-foreground leading-relaxed">
                      {bannerData.subtitle}
                    </p>
                  </div>
                )}

                {bannerData.link && (
                  <div className="space-y-1.5">
                    <span className="text-sm font-medium text-muted-foreground">
                      Link
                    </span>
                    <a
                      href={bannerData.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-base text-primary hover:underline break-all"
                    >
                      {bannerData.link}
                      <ExternalLink className="h-4 w-4 shrink-0" />
                    </a>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <span className="text-sm font-medium text-muted-foreground">
                    Type
                  </span>
                  <div>
                    <Badge
                      variant="outline"
                      className={
                        bannerData.type === "IMAGE"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-purple-50 text-purple-700 border-purple-200"
                      }
                    >
                      {bannerData.type === "IMAGE" ? (
                        <ImageIcon className="h-3 w-3 mr-1" />
                      ) : (
                        <VideoIcon className="h-3 w-3 mr-1" />
                      )}
                      {bannerData.type}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-sm font-medium text-muted-foreground">
                    Status
                  </span>
                  <div>
                    <Badge
                      variant={bannerData.isActive ? "default" : "secondary"}
                      className={
                        bannerData.isActive
                          ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {bannerData.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-sm font-medium text-muted-foreground">
                    Display Order
                  </span>
                  <p className="text-base text-foreground">
                    {bannerData.order}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Created Date
                  </span>
                  <p className="text-base text-foreground">
                    {formatDate(bannerData.createdAt)}
                  </p>
                </div>

                {bannerData.updatedAt && bannerData.updatedAt !== bannerData.createdAt && (
                  <div className="space-y-1.5">
                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Last Updated
                    </span>
                    <p className="text-base text-foreground">
                      {formatDate(bannerData.updatedAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info */}
            {bannerData.meta && (
              <div className="space-y-1.5 pt-4 border-t">
                <span className="text-sm font-medium text-muted-foreground">
                  Additional Metadata
                </span>
                <pre className="text-xs bg-muted p-3 rounded-md overflow-auto">
                  {JSON.stringify(bannerData.meta, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Close
            </Button>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ViewBanner;