"use client";

import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
TableRow,
} from "../ui/table";

export const TableSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* Search and Filter Bar Skeleton */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input Skeleton */}
        <div className="w-full md:w-64">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Filter Group Skeleton */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Status Filter Skeleton */}
          <div className="w-full sm:w-40">
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Date Range Skeletons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Skeleton className="h-10 w-32 rounded-md" />
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-5 w-4" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-12" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-16" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-12" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-16" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-12" />
              </TableHead>
              <TableHead className="text-right">
                <Skeleton className="h-5 w-16 ml-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-10 w-10 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[120px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[80px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-9 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[80px]" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-8 rounded-md" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
