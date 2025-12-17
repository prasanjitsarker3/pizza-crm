"use client";
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Check, ChevronsUpDown, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

interface SelectItem {
  id: string;
  title?: string;
  name?: string;
}

interface MultipleSelectDropdownProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedValues: string[];
  setSelectedValues: (ids: string[]) => void;
  options: SelectItem[];
  placeholder?: string;
  emptyText?: string;
  className?: string;
  clearable?: boolean;
}

const MultipleSelectDropdown: React.FC<MultipleSelectDropdownProps> = ({
  searchTerm,
  setSearchTerm,
  selectedValues,
  setSelectedValues,
  options,
  placeholder = "Select...",
  emptyText = "No items found.",
  className = "",
  clearable = true,
}) => {
  const [open, setOpen] = useState(false);

  // normalize items (always use `title || name || id`)
  const getLabel = (item: SelectItem) => item.title || item.name || item.id;

  const selectedItems = options.filter((item) =>
    selectedValues.includes(item.id)
  );

  const handleSelect = (id: string) => {
    if (selectedValues.includes(id)) {
      setSelectedValues(selectedValues.filter((item) => item !== id));
    } else {
      setSelectedValues([...selectedValues, id]);
    }
    setSearchTerm("");
  };

  const handleClear = (e: React.MouseEvent, id?: string) => {
    e.stopPropagation();
    if (id) {
      setSelectedValues(selectedValues.filter((item) => item !== id));
    } else {
      setSelectedValues([]);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-10 border-gray-100 cursor-pointer rounded-md group"
          >
            <div className="flex-1 text-left truncate font-normal">
              {selectedItems.length > 0
                ? `${selectedItems.length} selected`
                : placeholder}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-full p-0"
          align="start"
          side="bottom"
          sideOffset={4}
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search..."
              value={searchTerm}
              onValueChange={setSearchTerm}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options
                  .filter((item) =>
                    getLabel(item)
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((item) => (
                    <CommandItem
                      key={item.id}
                      value={getLabel(item)}
                      onSelect={() => handleSelect(item.id)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-1 h-4 w-4",
                          selectedValues.includes(item.id)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {getLabel(item)}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected badges */}
      <div className="mt-2 flex flex-wrap gap-2">
        {selectedItems.map((item) => (
          <Badge
            key={item.id}
            variant="secondary"
            className="flex items-center gap-1 pr-1"
          >
            {getLabel(item)}
            <button
              type="button"
              onClick={(e) => handleClear(e, item.id)}
              className="hover:text-red-500"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default MultipleSelectDropdown;
