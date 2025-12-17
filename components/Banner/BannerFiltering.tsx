import { useGetAllRolesQuery } from "@/redux/Api/roleApi";
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

interface IFilterBrand {
  active: string;
  startDate: string;
  endDate: string;
}

interface FilteringBrandProps {
  filter: IFilterBrand;
  setFilter: React.Dispatch<React.SetStateAction<IFilterBrand>>;
}

const FilteringBrand = ({
  filter,
  setFilter,
}: FilteringBrandProps) => {
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(
    filter.startDate ? new Date(filter.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    filter.endDate ? new Date(filter.endDate) : undefined
  );

  const handleApplyFilters = () => {
    setFilter({
      ...filter,
      startDate: startDate ? format(startDate, "yyyy-MM-dd") : "",
      endDate: endDate ? format(endDate, "yyyy-MM-dd") : "",
    });
    setOpen(false);
  };

  const handleClearFilters = () => {
    setFilter({
      active: "",
      startDate: "",
      endDate: "",
    });
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const hasActiveFilters =
    (filter.active && filter.active !== "all") ||
    filter.startDate ||
    filter.endDate;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2 relative shadow-none">
          <Filter className="h-4 w-4" />
          Filtering
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-600 text-[10px] text-white flex items-center justify-center">
              !
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 dark:bg-[#1F1F1F]" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Filter Banner</h4>
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

          <div className=" grid grid-cols-1 gap-2">
            {/* Verification Status Filter */}
            <div className="space-y-2">
              <Label htmlFor="verification">Active Status</Label>
              <Select
                value={filter.active || "all"}
                onValueChange={(value) =>
                  setFilter({ ...filter, active: value })
                }
              >
                <SelectTrigger
                  id="verification"
                  className=" w-full shadow-none"
                >
                  <SelectValue placeholder="All Users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Banner</SelectItem>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">In Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className=" grid grid-cols-1 gap-2">
            {/* Start Date Filter */}
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

            {/* End Date Filter */}
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

export default FilteringBrand;
