"use client";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
} from "@/redux/Api/userApi";
import React, { useEffect, useState } from "react";
import { TableSkeleton } from "../Common/TableSkeleton";
import { IUser } from "@/types/user.type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, Search, Trash2, X } from "lucide-react";
import { formatDate } from "@/utlits/formatDate";
import { getInitials, getRoleBadgeColor } from "./userHelpers";
import { PaginationMeta } from "@/types/IPagination";
import { Input } from "../ui/input";
import { PaginationControl } from "../Common/Pagination";
import Link from "next/link";
import UserCreateModal from "./UserCreateModal";
import FilteringUser from "./FilteringUser";
import ConfirmationAlert from "../BackUp/Alert";
import { toast } from "sonner";

interface IFilterUser {
  roleId: string;
  isVerified: string;
  startDate: string;
  endDate: string;
}

const UserTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectUser, setSelectUser] = useState<IUser | null>(null);
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [filter, setFilter] = useState<IFilterUser>({
    roleId: "",
    isVerified: "",
    startDate: "",
    endDate: "",
  });
  console.log("Filtering", filter);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filter]);

  const query: Record<string, any> = {
    page: currentPage,
    limit,
  };

  if (searchTerm) {
    query.searchTerm = searchTerm;
  }

  if (filter.roleId && filter.roleId !== "all") {
    query.roleId = filter.roleId;
  }

  if (filter.isVerified && filter.isVerified !== "all") {
    query.isVerified = filter.isVerified;
  }

  if (filter.startDate) {
    query.startDate = filter.startDate;
  }

  if (filter.endDate) {
    query.endDate = filter.endDate;
  }
  const { data, isLoading } = useGetAllUsersQuery(query);

  if (isLoading) {
    return <TableSkeleton />;
  }

  const userData: IUser[] = data?.data?.data || [];
  console.log("User Data", data?.data?.data)
  const userMetaData: PaginationMeta = data?.data?.meta || {
    page: 1,
    limit,
    total: 0,
  };

  const totalPages = Math.ceil(userMetaData.total / userMetaData.limit);
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

  const handleDeleteClick = (user: IUser) => {
    setOpenDeleteModal(true);
    setSelectUser(user);
    setDropdownOpenId(null);
  };

  const handleDeleteConfirmation = async () => {
    const toastId = toast.loading("Processing...");
    try {
      const response = await deleteUser(selectUser?.id as string).unwrap();
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
    <div className=" space-y-3">
      <div className=" w-full flex justify-between items-center">
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
        <div className=" flex items-center gap-3">
          <FilteringUser filter={filter} setFilter={setFilter} />
          <Button onClick={() => setOpenUserModal(true)} className=" dark:bg-[#ff7200]  dark:text-white">Create User</Button>
        </div>
      </div>
      <div className=" rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>

              <TableHead>Status</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="">
                  <div className="text-red-500 p-2 md:p-8 bg-red-50 text-center">
                    <p className="text-lg font-medium">No users found</p>
                    <p className="text-sm">
                      No registered users in the system yet
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              userData.map((user, index) => (
                <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                  <TableCell className="font-medium text-gray-500">
                    {(currentPage - 1) * limit + index + 1}
                  </TableCell>

                  {/* USER */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar || undefined} alt={user.name} />
                        <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-500 text-white">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        {user.bio && (
                          <p className="text-xs text-gray-500 max-w-[200px] truncate">
                            {user.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* EMAIL */}
                  <TableCell className="text-gray-600 dark:text-white/70">
                    {user.email}
                  </TableCell>

                  {/* PHONE */}
                  <TableCell className="text-gray-600 dark:text-white/70">
                    {user.phone || (
                      <span className="italic text-gray-400">Not provided</span>
                    )}
                  </TableCell>

                  {/* ROLE */}
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>



                  {/* VERIFIED */}
                  <TableCell>
                    <Badge
                      variant={user.isActive ? "default" : "secondary"}
                      className={
                        user.isActive
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      }
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>


                  {/* DATE */}
                  <TableCell className="text-gray-600 dark:text-white/70">
                    {formatDate(user.createdAt)}
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell className="text-right">
                    <DropdownMenu
                      open={dropdownOpenId === user.id}
                      onOpenChange={(open) =>
                        setDropdownOpenId(open ? user.id : null)
                      }
                    >
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>

                        <DropdownMenuItem asChild>
                          <Link
                            href={`/admin/users/${user.id}/view`}
                            className="flex items-center"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(user)}
                          className="text-red-600 cursor-pointer"
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
      <div className=" py-4">
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={userMetaData?.total}
          itemsPerPage={userMetaData?.limit}
        />
      </div>

      <UserCreateModal open={openUserModal} onOpenChange={setOpenUserModal} />

      {selectUser && openDeleteModal && (
        <ConfirmationAlert
          isOpen={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          onConfirm={handleDeleteConfirmation}
          actionType="delete"
          itemName={selectUser?.name}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default UserTable;
