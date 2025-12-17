"use client";
import React, { useEffect, useState } from "react";
import CouponCreate from "./CouponCreate";
import {
  useDeleteGiftCardCouponMutation,
  useGetAllCouponQuery,
} from "@/redux/Api/couponApi";
import { TableSkeleton } from "../Common/TableSkeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Gift,
  Percent,
  DollarSign,
  Ticket,
  Calendar,
  Image,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Search,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { Coupon, GiftKeyType } from "@/types/coupon.type";
import { formatDate, getValueDisplay, isExpired } from "./couponHelper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import UpdateCoupon from "./UpdateCoupon";
import ConfirmationAlert from "../BackUp/Alert";
import { toast } from "sonner";
import { PaginationMeta } from "@/types/IPagination";
import { Input } from "../ui/input";
import { PaginationControl } from "../Common/Pagination";
import CouponFiltering, { ICouponFilter } from "./CouponFiltering";
import { useDebounce } from "@/hooks/useDebounce";

const CouponTable = () => {
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
  const [selectCoupon, setSelectCoupon] = useState<Coupon | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteCoupon, { isLoading: isDeleting }] =
    useDeleteGiftCardCouponMutation();

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<ICouponFilter>({
    type: "",
    startDate: "",
    endDate: "",
  });

  const debouncedSearch = useDebounce(searchTerm, 500);
  const debouncedFilter = useDebounce(filter, 500);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, debouncedFilter]);

  const query: Record<string, any> = {
    page: currentPage,
    limit,
  };

  if (debouncedSearch) {
    query.searchTerm = debouncedSearch;
  }

  if (debouncedFilter.type && debouncedFilter.type !== "all") {
    query.type = debouncedFilter.type;
  }

  if (debouncedFilter.startDate) {
    query.startDate = debouncedFilter.startDate;
  }

  if (debouncedFilter.endDate) {
    query.endDate = debouncedFilter.endDate;
  }

  const { data, isLoading, error } = useGetAllCouponQuery(query);

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg">
        <div className="text-center text-red-500">
          Error loading coupons. Please try again.
        </div>
      </div>
    );
  }

  const couponData: Coupon[] = data?.data?.data || [];
  const couponMetaData: PaginationMeta = data?.data?.meta || {
    page: 1,
    limit,
    total: 0,
  };

  const totalPages = Math.ceil(couponMetaData.total / couponMetaData.limit);
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

  const getTypeBadge = (type: GiftKeyType) => {
    const typeConfig = {
      [GiftKeyType.POINTS]: {
        label: "Points",
        variant: "default" as const,
        icon: Gift,
      },
      [GiftKeyType.PERCENT_OFF]: {
        label: "Percent Off",
        variant: "secondary" as const,
        icon: Percent,
      },
      [GiftKeyType.AMOUNT_OFF]: {
        label: "Amount Off",
        variant: "destructive" as const,
        icon: DollarSign,
      },
      [GiftKeyType.COUPON]: {
        label: "Coupon",
        variant: "outline" as const,
        icon: Ticket,
      },
    };

    const config = typeConfig[type];
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const handleUpdateCoupon = (coupon: Coupon) => {
    setSelectCoupon(coupon);
    setDropdownOpenId(null);
    setOpenEditModal(true);
  };

  const handleDeleteClick = (coupon: Coupon) => {
    setSelectCoupon(coupon);
    setDropdownOpenId(null);
    setOpenDeleteModal(true);
  };

  const handleDeleteConfirmation = async () => {
    const toastId = toast.loading("Processing...");
    try {
      const response = await deleteCoupon(selectCoupon?.id as string).unwrap();
      if (response?.statusCode === 200) {
        toast.success(response?.message, { id: toastId, duration: 1000 });
        setOpenDeleteModal(false);
      } else {
        toast.error(response?.message, { id: toastId, duration: 1000 });
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.message || "Something went wrong!",
        { id: toastId }
      );
      console.error("Update error:", error);
    }
  };

  return (
    <div className=" p-3 bg-white dark:bg-background rounded-lg">
      <div className="flex justify-between items-center mb-6">
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
            className="h-10 cursor-pointer bg-primary text-white hover:bg-primary"
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

        <div className=" flex items-center gap-2">
          <CouponCreate />
          <CouponFiltering filter={filter} setFilter={setFilter} />
        </div>
      </div>

      {couponData.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No coupons found
          </h3>
          <p className="text-gray-600 mb-4">
            Get started by creating your first gift card or coupon.
          </p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {couponData.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell>
                    {coupon.img ? (
                      <div className="w-10 h-10 rounded border overflow-hidden">
                        <img
                          src={coupon.img}
                          alt={coupon.code}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded border flex items-center justify-center bg-gray-100">
                        <Image className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-mono font-semibold">
                    {coupon.code}
                  </TableCell>
                  <TableCell>{getTypeBadge(coupon.type)}</TableCell>
                  <TableCell className="font-medium">
                    {getValueDisplay(coupon)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span>
                        {coupon.redeemedCount} / {coupon.maxRedemptions}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span
                        className={
                          isExpired(coupon.expiresAt)
                            ? "text-red-500 line-through"
                            : "text-gray-700"
                        }
                      >
                        {formatDate(coupon.expiresAt)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        isExpired(coupon.expiresAt)
                          ? "destructive"
                          : coupon.redeemedCount >= coupon.maxRedemptions
                          ? "secondary"
                          : "default"
                      }
                    >
                      {isExpired(coupon.expiresAt)
                        ? "Expired"
                        : coupon.redeemedCount >= coupon.maxRedemptions
                        ? "Fully Redeemed"
                        : "Active"}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-sm text-gray-600">
                    {format(new Date(coupon.createdAt), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu
                      open={dropdownOpenId === coupon.id}
                      onOpenChange={(open) =>
                        setDropdownOpenId(open ? coupon.id : null)
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
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>

                        <DropdownMenuItem
                          asChild
                          //   onClick={() => handleViewModal(collection)}
                        >
                          <div className="flex items-center cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </div>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          asChild
                          onClick={() => handleUpdateCoupon(coupon)}
                        >
                          <div className="flex items-center cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </div>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(coupon)}
                          className="text-red-600 focus:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className=" py-4">
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={couponMetaData?.total}
          itemsPerPage={couponMetaData?.limit}
        />
      </div>

      {selectCoupon && openEditModal && (
        <UpdateCoupon
          couponData={selectCoupon}
          open={openEditModal}
          onOpenChange={setOpenEditModal}
        />
      )}
      {openDeleteModal && (
        <ConfirmationAlert
          isOpen={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          onConfirm={handleDeleteConfirmation}
          actionType="delete"
          itemName={selectCoupon?.code}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default CouponTable;
