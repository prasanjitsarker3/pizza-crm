


"use client";
import {
  useBannerPublishingMutation,
  useDeleteBannerMutation,
  useGetAllBannersQuery,
} from "@/redux/Api/bannerApi";
import React, { useState, useEffect } from "react";
import { TableSkeleton } from "../Common/TableSkeleton";
import CreateBannerForm from "./CreateBanner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Eye,
  MoreHorizontal,
  Trash2,
  Edit,
  ExternalLink,
  Search,
  X,
  Image as ImageIcon,
  Video as VideoIcon,
} from "lucide-react";
import { truncateText } from "@/utlits/truncateText";
import { formatDate } from "@/utlits/formatDate";
import UpdateBanner from "./UpdateBanner";
import ConfirmationAlert from "../BackUp/Alert";
import { toast } from "sonner";
import ViewBanner from "./ViewBanner";
import { PaginationMeta } from "@/types/IPagination";
import { Input } from "../ui/input";
import { PaginationControl } from "../Common/Pagination";
import FilteringBrand from "./BannerFiltering";
import { IBanner } from "@/types/banner.type";

interface IFilterBrand {
  active: string;
  startDate: string;
  endDate: string;
}

const BannerTable = () => {
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
  const [selectBanner, setSelectBanner] = useState<IBanner | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openPublishModal, setOpenPublishModal] = useState(false);

  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();
  const [bannerPublishing, { isLoading: isPublishing }] =
    useBannerPublishingMutation();

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [filter, setFilter] = useState<IFilterBrand>({
    active: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const query: Record<string, any> = {
    page: currentPage,
    limit,
  };

  if (searchTerm) {
    query.searchTerm = searchTerm;
  }

  if (filter.active && filter.active !== "all") {
    query.active = filter.active;
  }

  if (filter.startDate) {
    query.startDate = filter.startDate;
  }

  if (filter.endDate) {
    query.endDate = filter.endDate;
  }

  const { data, isLoading } = useGetAllBannersQuery(query);

  if (isLoading) {
    return <TableSkeleton />;
  }

  const bannerData: IBanner[] = data?.data?.data || data?.data || [];
  const bannerMetaData: PaginationMeta = data?.meta || data?.data?.meta || {
    page: 1,
    limit,
    total: 0,
  };

  const totalPages = Math.ceil(bannerMetaData.total / bannerMetaData.limit);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchTerm(searchInput);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
  };

  const handleViewModal = (banner: IBanner) => {
    setSelectBanner(banner);
    setOpenViewModal(true);
    setDropdownOpenId(null);
  };

  const handleEditClick = (banner: IBanner) => {
    setSelectBanner(banner);
    setOpenEditModal(true);
    setDropdownOpenId(null);
  };

  const handleDeleteClick = (banner: IBanner) => {
    setSelectBanner(banner);
    setOpenDeleteModal(true);
    setDropdownOpenId(null);
  };

  const handlePublishBanner = (banner: IBanner) => {
    setSelectBanner(banner);
    setOpenPublishModal(true);
    setDropdownOpenId(null);
  };

  const handleDeleteConfirmation = async () => {
    const toastId = toast.loading("Processing...");
    try {
      const response = await deleteBanner(selectBanner?.id as string).unwrap();
      if (response?.statusCode === 200 || response.success === true) {
        toast.success(response?.message || "Delete Successfully!", {
          id: toastId,
          duration: 1000,
        });
        setOpenDeleteModal(false);
      } else {
        toast.error(response?.message, { id: toastId, duration: 1000 });
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.message || "Something went wrong!",
        { id: toastId }
      );
      console.error("Delete error:", error);
    }
  };

  const handlePublishConfirmation = async () => {
    const toastId = toast.loading("Processing...");
    if (!selectBanner) {
      return toast.warning("Banner Select!");
    }
    try {
      const response = await bannerPublishing({
        id: selectBanner.id as string,
        active: !selectBanner.isActive,
      }).unwrap();
      if (response?.statusCode === 200 || response?.success === true) {
        toast.success(response?.message || "Publishing successfully!", {
          id: toastId,
          duration: 1000,
        });
        setOpenPublishModal(false);
      } else {
        toast.error(response?.message, { id: toastId, duration: 1000 });
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.message || "Something went wrong!",
        { id: toastId }
      );
      console.error("Publish error:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="w-full flex justify-between items-center">
        <form
          onSubmit={handleSearch}
          className="flex w-full max-w-sm items-center space-x-2"
        >
          <Input
            type="text"
            placeholder="Search by title..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="h-10 shadow-none"
          />
          <Button
            type="submit"
            size="sm"
            className="h-10 cursor-pointer bg-primary text-white hover:bg-primary dark:bg-[#ff7200]"
          >
            <Search className="h-4 w-4 mr-1" />
          </Button>
          {searchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="h-9 px-2 cursor-pointer bg-red-100 text-red-500"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </form>
        <div className="flex items-center gap-2">
          <CreateBannerForm />
          <FilteringBrand filter={filter} setFilter={setFilter} />
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>

              <TableHead className="w-[200px]">Media</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Subtitle</TableHead>
              <TableHead className="">Type</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bannerData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="">
                  <div className="text-red-500 p-2 md:p-8 dark:bg-black bg-red-50 text-center">
                    <p className="text-lg font-medium">No banners found</p>
                    <p className="text-sm">
                      Create your first banner to get started
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              bannerData.map((banner, index) => (
                <TableRow
                  key={banner.id}
                  className="hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  <TableCell className="font-medium text-gray-500">
                    {(currentPage - 1) * limit + index + 1}
                  </TableCell>



                  <TableCell>
                    <div className="relative w-full h-20 rounded-lg overflow-hidden border bg-gray-100">
                      {banner.type === "IMAGE" && banner.image ? (
                        <img
                          src={banner.image}
                          alt={banner.title || "Banner"}
                          className="w-full h-full object-cover"
                        />
                      ) : banner.type === "VIDEO" && banner.video ? (
                        <div className="relative w-full h-full">
                          <video
                            src={banner.video}
                            className="w-full h-full object-cover"
                            muted
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <VideoIcon className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span className="text-xs">No media</span>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <p className="font-medium text-gray-900 dark:text-white/70">
                      {banner.title || (
                        <span className="text-gray-400 italic">No title</span>
                      )}
                    </p>
                  </TableCell>

                  <TableCell className="text-gray-600 dark:text-white/70 max-w-[200px]">
                    {banner.subtitle ? (
                      truncateText(banner.subtitle, 40)
                    ) : (
                      <span className="text-gray-400 italic">No subtitle</span>
                    )}
                  </TableCell>


                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        banner.type === "IMAGE"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-purple-50 text-purple-700 border-purple-200"
                      }
                    >
                      {banner.type === "IMAGE" ? (
                        <ImageIcon className="h-3 w-3 mr-1" />
                      ) : (
                        <VideoIcon className="h-3 w-3 mr-1" />
                      )}
                      {banner.type}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {banner.link ? (
                      <a
                        href={banner.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline max-w-[150px] truncate"
                      >
                        <span className="truncate">{banner.link}</span>
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">No link</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={banner.isActive ? "default" : "destructive"}
                      className={
                        banner.isActive
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : ""
                      }
                    >
                      {banner.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-gray-600 dark:text-white/70">
                    {formatDate(banner.createdAt)}
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu
                      open={dropdownOpenId === banner.id}
                      onOpenChange={(open) =>
                        setDropdownOpenId(open ? banner.id : null)
                      }
                    >
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-gray-100"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 dark:bg-[#1F1F1F]"
                      >
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>

                        <DropdownMenuItem
                          onClick={() => handleViewModal(banner)}
                          className="cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleEditClick(banner)}
                          className="cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Banner
                        </DropdownMenuItem>


                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(banner)}
                          className="text-red-600 focus:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="pb-4">
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={bannerMetaData?.total}
          itemsPerPage={bannerMetaData?.limit}
        />
      </div>

      {selectBanner && openEditModal && (
        <UpdateBanner
          bannerData={selectBanner}
          open={openEditModal}
          onOpenChange={setOpenEditModal}
        />
      )}

      {selectBanner && openViewModal && (
        <ViewBanner
          bannerData={selectBanner}
          open={openViewModal}
          onOpenChange={setOpenViewModal}
        />
      )}

      {openDeleteModal && (
        <ConfirmationAlert
          isOpen={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          onConfirm={handleDeleteConfirmation}
          actionType="delete"
          itemName={selectBanner?.title}
          isLoading={isDeleting}
        />
      )}

      {openPublishModal && (
        <ConfirmationAlert
          isOpen={openPublishModal}
          onClose={() => setOpenPublishModal(false)}
          onConfirm={handlePublishConfirmation}
          actionType={selectBanner?.isActive ? "unpublish" : "publish"}
          itemName={selectBanner?.title}
          isLoading={isPublishing}
        />
      )}
    </div>
  );
};

export default BannerTable;