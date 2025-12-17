"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch } from "@/redux/hooks";
import { setBreadcrumbs } from "@/redux/Slice/breadcrumbSlice";
import { useGetSingleUserQuery } from "@/redux/Api/userApi";
import { ViewUser } from "./ViewUser";
import type { IUser } from "@/types/user.type";

export default function UserViewPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const { data, isLoading } = useGetSingleUserQuery(id as string, {
    skip: !id,
  });

  const userData: IUser | null = data?.data ?? null;
  console.log("User Data", userData)

  useEffect(() => {
    if (id) {
      dispatch(
        setBreadcrumbs([
          { label: "Users", path: "/admin/users" },
          { label: "User Details", path: `/admin/users/${id}`, active: false },
        ])
      );
    }
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-48 w-full" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">User not found</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6">
      <ViewUser user={userData} />
    </div>
  );
}
