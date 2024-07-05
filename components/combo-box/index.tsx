"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FieldValues, UseFormReturn } from "react-hook-form";

const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const;

type Data = {
  label: string;
  value: string | number | undefined;
}[];

type Props = {
  name: string;
  label: string;
  form:any;
  data: Data;
  emptyMessage?: string;
};

const Combobox = ({
  name,
  label,
  form,
  data,
  emptyMessage = "Not Found",
  ...rest
}: Props) => {
  const d1 = [...data] as const;

  return (
    // <Form {...form}>
      <FormField
        name={name}
        control={form.control}
        render={({ field }) => (
          <FormItem className="flex w-full flex-col">
            {/* <FormLabel>{label}</FormLabel> */}
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full appearance-none  justify-between rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    {field.value
                      ? d1.find((d) => d?.value?.toString() === field.value.toString())?.label
                      : "---Select---"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[470px] p-0 z-99999">
                <Command className="w-full">
                  <CommandInput placeholder="Search..." />
                  <CommandEmpty>{emptyMessage}</CommandEmpty>
                  <CommandGroup>
                    {d1.map((d) => (
                      <CommandItem
                        value={d?.value?.toString()}
                        key={d?.value}
                        onSelect={() => {
                          form.setValue(name, d?.value ?? "");
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            d?.value === field.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {d?.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    // </Form>
  );
};

export default Combobox;
