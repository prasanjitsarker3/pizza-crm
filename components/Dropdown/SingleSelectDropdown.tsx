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

interface SelectItem {
  id: string;
  name?: string;
  title?: string;
}

interface SingleSelectDropdownProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedValue: string;
  setSelectedValue: (id: string) => void;
  options: SelectItem[];
  placeholder?: string;
  emptyText?: string;
  required?: boolean;
  errorMessage?: string;
  className?: string;
  clearable?: boolean;
}

const SingleSelectDropdown: React.FC<SingleSelectDropdownProps> = ({
  searchTerm,
  setSearchTerm,
  selectedValue,
  setSelectedValue,
  options,
  placeholder = "Select...",
  emptyText = "No items found.",
  required = false,
  errorMessage = "This field is required",
  className = "",
  clearable = true,
}) => {
  const [open, setOpen] = useState(false);
  const [touched, setTouched] = useState(false);

  // Normalize label
  const getLabel = (item: SelectItem) => item.name || item.title || item.id;

  const selectedItem = options.find((item) => item.id === selectedValue);
  const showError = required && touched && !selectedValue;

  const handleSelect = (id: string) => {
    setSelectedValue(id);
    setOpen(false);
    setSearchTerm("");
    setTouched(true);
  };

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-required={required}
            aria-invalid={showError}
            className={cn(
              "w-full justify-between h-10 border-gray-100 cursor-pointer rounded-md group",
              showError && "border-red-500"
            )}
            onClick={() => setTouched(true)}
          >
            <span className="truncate font-normal">
              {selectedItem ? getLabel(selectedItem) : placeholder}
            </span>
            <div className="flex items-center gap-1">
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
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
                          selectedValue === item.id
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

      {clearable && selectedItem && (
        <div className=" mt-1 flex items-center gap-1 text-sm bg-primary text-white py-0.5 px-1 w-fit rounded-full">
          {getLabel(selectedItem)}
          <X
            className=" cursor-pointer"
            size={16}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedValue("");
              setTouched(true);
            }}
          />
        </div>
      )}

      {showError && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default SingleSelectDropdown;
