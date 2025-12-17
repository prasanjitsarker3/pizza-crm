"use client";
import { TableSkeleton } from "@/components/Common/TableSkeleton";
import {
  useDeleteProductMutation,
  useGetAllProductsQuery,
} from "@/redux/Api/productApi";
import React, { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Search,
  Plus,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { IProduct } from "@/types/product.type";
import ConfirmationAlert from "../BackUp/Alert";
import { toast } from "sonner";
import { PaginationMeta } from "@/types/IPagination";
import { PaginationControl } from "../Common/Pagination";

const ProductTableData = () => {
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [filter, setFilter] = useState<any>({
    isDisplay: "all",
    startDate: "",
    endDate: "",
    categories: []
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

  if (filter.categories?.length) {
    query.categories = filter.categories;
  }
  if (filter.startDate) {
    query.startDate = filter.startDate;
  }
  if (filter.endDate) {
    query.endDate = filter.endDate;
  }

  const router = useRouter();

  const { data, isLoading } = useGetAllProductsQuery(query);

  if (isLoading) {
    return <TableSkeleton />;
  }

  const productData: IProduct[] = data?.data?.data || [];
  const productMetaData: PaginationMeta = data?.data?.meta || {
    page: 1,
    limit,
    total: 0,
  };

  const totalPages = Math.ceil(productMetaData.total / productMetaData.limit);

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

  const handleView = (product: IProduct) => {
    router.push(`/admin/products/${product?.id}/view`);
  };

  const handleEdit = (product: IProduct) => {
    router.push(`/admin/products/${product?.id}/edit`);
  };

  const handleDelete = (product: IProduct) => {
    setSelectedProduct(product);
    setDropdownOpenId(null);
    setOpenDeleteModal(true);
  };

  const calculateDiscountedPrice = (price: number, discount: number | null) => {
    if (!discount) return price.toFixed(2);
    return (price - discount).toFixed(2);
  };

  const handleDeleteConfirmation = async () => {
    const toastId = toast.loading("Processing...");
    try {
      const response = await deleteProduct(
        selectedProduct?.id as string
      ).unwrap();
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
    <div className="w-full p-3">
      <div className="w-full flex justify-between items-center mb-5">
        <form
          onSubmit={handleSearch}
          className="flex w-full max-w-sm items-center space-x-2"
        >
          <Input
            type="text"
            placeholder="Search by name..."
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
        <div className="flex items-center gap-2">
          <Link href={"/admin/products/create"}>
            <Button
              type="submit"
              size="sm"
              className="h-10 cursor-pointer bg-primary text-white hover:bg-primary"
            >
              <Plus /> Create Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Spicy Level</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center h-24">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              productData.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.mainImages[0] ? (
                      <div className="relative w-12 h-12 rounded-md overflow-hidden">
                        <Image
                          src={product.mainImages[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-xs text-gray-400">No img</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {product.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold">
                        ${calculateDiscountedPrice(product.price, product.discount)}
                      </span>
                      {product.discount && (
                        <span className="text-xs text-gray-400 line-through">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.discount ? (
                      <Badge className="bg-red-100 text-red-500 hover:bg-red-100 hover:text-red-700">
                        ${product.discount.toFixed(2)}
                      </Badge>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {product.categories.slice(0, 2).map((category) => (
                        <Badge
                          key={category.id}
                          variant="outline"
                          className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {category.name}
                        </Badge>
                      ))}
                      {product.categories.length > 2 && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-gray-100 text-gray-600"
                        >
                          +{product.categories.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {product.spicyLevel.slice(0, 2).map((level, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className={`text-xs ${level === "HIGH"
                              ? "bg-red-100 text-red-700 border-red-200"
                              : level === "MEDIUM"
                                ? "bg-orange-100 text-orange-700 border-orange-200"
                                : level === "LOW"
                                  ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                  : "bg-gray-100 text-gray-700 border-gray-200"
                            }`}
                        >
                          {level}
                        </Badge>
                      ))}
                      {product.spicyLevel.length > 2 && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-gray-100 text-gray-600"
                        >
                          +{product.spicyLevel.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {product.featured && (
                        <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 text-xs w-fit">
                          Featured
                        </Badge>
                      )}
                      {product.popular && (
                        <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-100 text-xs w-fit">
                          Popular
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={product.isDeleted ? "destructive" : "secondary"}
                      className={
                        product.isDeleted
                          ? ""
                          : "bg-green-100 text-green-700 hover:bg-green-100 hover:text-green-700"
                      }
                    >
                      {product.isDeleted ? "Deleted" : product.available ? "Available" : "Unavailable"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu
                      open={dropdownOpenId === product.id}
                      onOpenChange={(open) =>
                        setDropdownOpenId(open ? product.id : null)
                      }
                    >
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleView(product)}
                          className="cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEdit(product)}
                          className="cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(product)}
                          className="cursor-pointer text-red-600"
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

      <div className="py-4">
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={productMetaData?.total}
          itemsPerPage={productMetaData?.limit}
        />
      </div>

      {selectedProduct && openDeleteModal && (
        <ConfirmationAlert
          isOpen={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          onConfirm={handleDeleteConfirmation}
          actionType="delete"
          itemName={selectedProduct?.name}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default ProductTableData;