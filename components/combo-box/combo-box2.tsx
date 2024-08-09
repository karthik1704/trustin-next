"use client";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
// import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { CheckIcon, ChevronDown } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";
type RegisterFunction = UseFormRegister<FieldValues>;

type Data = {
  name: string;
  value: string | number;
};

type Props = {
  data: Data[];
  name: string;
  register?: RegisterFunction | undefined | any;
  onChange:any;
  onBlur:any;
  value: string|number;
  disabled?:boolean;
};

export default function ComboBox2({ data, register, name, onChange,onBlur, value, disabled=false }: Props) {
  const [query, setQuery] = useState("");

  const filteredData =
    query === ""
      ? data
      : data.filter((d) => {
          return d.name.toLowerCase().includes(query.toLowerCase());
        });

  const getNameFromValue = (value: string | number) => {
          const d1 = data.find((d) => value? d.value.toString() === value.toString():"");
          return d1 ? d1.name : "";
        };
  return (
    <div className="relative">
      <Combobox
        as={"div"}
        immediate
        // name={name}
        value={value ? value.toString():""}
       onChange={onChange}
        onClose={() => setQuery("")}
      >
        <ComboboxInput
          className="relative w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          aria-label={name}
          // {...register?.(name)}
          autoComplete="off"
          displayValue={(value: string | number) => getNameFromValue(value)}
          onChange={(event) => setQuery(event.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          placeholder="--- Select ---"
        />
         <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
            <ChevronDown className="size-4 fill-black/60 group-data-[hover]:fill-black" />
          </ComboboxButton>
        <ComboboxOptions anchor="bottom" className={clsx(
            'z-9999 overflow-hidden w-[var(--input-width)] h-50 rounded border border-primary bg-white p-1 [--anchor-gap:var(--spacing-1)] empty:invisible',
            'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
          )}>
          {filteredData.map((d) => (
            <ComboboxOption
              key={d.value}
              value={d.value}
              className="data-[focus]:bg-blue-100 fill-bg-white"
            >
              {d.name}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
}
