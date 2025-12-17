"use client";

import React, { useEffect, useState } from "react";
import {
  useDeleteCaegoryMutation,
  useGetAllCategorysQuery,
} from "@/redux/Api/categroyApi";

import { TableSkeleton } from "../Common/TableSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Edit,
  Eye,
  MoreHorizontal,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { truncateText } from "@/utlits/truncateText";
import { formatDate } from "@/utlits/formatDate";
import { PaginationControl } from "../Common/Pagination";
import ConfirmationAlert from "../BackUp/Alert";
import FilteringBrand from "./BrandFiltering";
import CreateCategory from "./CreateCategory";
import UpdateCategory from "./UpdateCategory";
import ViewCategory from "./ViewCategory";
import { toast } from "sonner";
import { PaginationMeta } from "@/types/IPagination";

/* =======================
   Category Interface
======================= */
export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface IFilterCategory {
  isActive: string;
  startDate: string;
  endDate: string;
}

const CategoryTable = () => {
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<ICategory | null>(null);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [filter, setFilter] = useState<IFilterCategory>({
    isActive: "",
    startDate: "",
    endDate: "",
  });

  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCaegoryMutation();

  /* =======================
     Reset page on search
  ======================= */
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  /* =======================
     Query Params
  ======================= */
  const query: Record<string, any> = {
    page: currentPage,
    limit,
  };

  if (searchTerm) query.searchTerm = searchTerm;

  if (filter.isActive && filter.isActive !== "all") {
    query.isActive = filter.isActive === "true";
  }

  if (filter.startDate) query.startDate = filter.startDate;
  if (filter.endDate) query.endDate = filter.endDate;

  const { data, isLoading } = useGetAllCategorysQuery(query);

  if (isLoading) return <TableSkeleton />;

  /* =======================
     Data & Meta
  ======================= */
  const categoryData: ICategory[] = data?.data?.data || [];
  const meta: PaginationMeta = data?.data?.meta || {
    page: 1,
    limit,
    total: 0,
  };

  const totalPages = Math.ceil(meta.total / meta.limit);

  /* =======================
     Handlers
  ======================= */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchInput);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;

    const toastId = toast.loading("Deleting...");
    try {
      const res = await deleteCategory(selectedCategory.id).unwrap();
      toast.success(res?.message || "Deleted successfully", { id: toastId });
      setOpenDeleteModal(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Delete failed", { id: toastId });
    }
  };

  /* =======================
     Render
  ======================= */
  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <div className="flex justify-between items-center">
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 max-w-sm w-full"
        >
          <Input
            placeholder="Search category..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button size="sm">
            <Search className="w-4 h-4" />
          </Button>
          {searchTerm && (
            <Button size="sm" variant="destructive" onClick={clearSearch}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </form>

        <div className="flex gap-2">
          <CreateCategory />
          {/* <FilteringBrand filter={filter} setFilter={setFilter} /> */}
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {categoryData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              categoryData.map((category, index) => (
                <TableRow key={category.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    {category.name}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    {truncateText(category.description, 30)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        category.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(category.createdAt)}</TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu
                      open={dropdownOpenId === category.id}
                      onOpenChange={(open) =>
                        setDropdownOpenId(open ? category.id : null)
                      }
                    >
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>

                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedCategory(category);
                            setOpenViewModal(true);
                          }}
                        >
                          <Eye className="mr-2 w-4 h-4" /> View
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedCategory(category);
                            setOpenEditModal(true);
                          }}
                        >
                          <Edit className="mr-2 w-4 h-4" /> Edit
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setSelectedCategory(category);
                            setOpenDeleteModal(true);
                          }}
                        >
                          <Trash2 className="mr-2 w-4 h-4" /> Delete
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

      {/* Pagination */}
      <PaginationControl
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={meta.total}
        itemsPerPage={meta.limit}
      />

      {/* Modals */}
      {selectedCategory && openEditModal && (
        <UpdateCategory
          categoryData={selectedCategory}
          open={openEditModal}
          onOpenChange={setOpenEditModal}
        />
      )}

      {selectedCategory && openViewModal && (
        <ViewCategory
          categoryData={selectedCategory}
          open={openViewModal}
          onOpenChange={setOpenViewModal}
        />
      )}

      {openDeleteModal && (
        <ConfirmationAlert
          isOpen={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
          actionType="delete"
          itemName={selectedCategory?.name}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default CategoryTable;
