"use client";

import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Filter, X } from "lucide-react";
import { format } from "date-fns";

export interface ICouponFilter {
  type: string;
  startDate: string;
  endDate: string;
}

interface CouponFilteringProps {
  filter: ICouponFilter;
  setFilter: React.Dispatch<React.SetStateAction<ICouponFilter>>;
}

const CouponFiltering = ({ filter, setFilter }: CouponFilteringProps) => {
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(
    filter.startDate ? new Date(filter.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    filter.endDate ? new Date(filter.endDate) : undefined
  );

  // ✅ Apply filter
  const handleApplyFilters = () => {
    setFilter({
      ...filter,
      startDate: startDate ? format(startDate, "yyyy-MM-dd") : "",
      endDate: endDate ? format(endDate, "yyyy-MM-dd") : "",
    });
    setOpen(false);
  };

  // ✅ Clear all filters
  const handleClearFilters = () => {
    setFilter({
      type: "",
      startDate: "",
      endDate: "",
    });
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const hasActiveFilters = filter.type || filter.startDate || filter.endDate;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2 relative shadow-none">
          <Filter className="h-4 w-4" />
          Filter Coupons
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-600 text-[10px] text-white flex items-center justify-center">
              !
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Filter Coupons</h4>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-8 px-2 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            )}
          </div>

          {/* Coupon Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Coupon Type</Label>
            <Select
              value={filter.type || "all"}
              onValueChange={(value) =>
                setFilter({ ...filter, type: value === "all" ? "" : value })
              }
            >
              <SelectTrigger id="type" className="w-full shadow-none">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="POINTS">Points</SelectItem>
                <SelectItem value="PERCENT_OFF">Percent Off</SelectItem>
                <SelectItem value="AMOUNT_OFF">Amount Off</SelectItem>
                <SelectItem value="COUPON">Coupon</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Start & End Date */}
          <div className="grid grid-cols-1 gap-2">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal shadow-none"
                  >
                    {startDate ? (
                      format(startDate, "PPP")
                    ) : (
                      <span className="text-muted-foreground">Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal shadow-none"
                  >
                    {endDate ? (
                      format(endDate, "PPP")
                    ) : (
                      <span className="text-muted-foreground">Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={(date) => (startDate ? date < startDate : false)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Apply Button */}
          <Button onClick={handleApplyFilters} className="w-full">
            Apply Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CouponFiltering;
