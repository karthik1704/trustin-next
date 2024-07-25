"use client";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  ComboboxButton,
} from "@headlessui/react";
import { CheckIcon, ChevronDown } from "lucide-react";
import clsx from "clsx";

import { useState } from "react";
type Data = {
  name: string;
  value: string | number;
};

type Props = {
  data: Data[];
  name: string;
  value: string | number;
};

export default function UncontrolledComboBox({ data, name, value }: Props) {
  const [query, setQuery] = useState("");

  const filteredPeople =
    query === ""
      ? data
      : data.filter((d) => {
          return d.name.toLowerCase().includes(query.toLowerCase());
        });
  const getNameFromValue = (value: string | number) => {
    const d1 = data.find((d) =>
      value ? d.value.toString() === value.toString() : "",
    );
    return d1 ? d1.name : "";
  };
  return (
    <div className="relative">
      <Combobox
        as={"div"}
        immediate
        name={name}
        defaultValue={value}
        onClose={() => setQuery("")}
      >
        <ComboboxInput
          autoComplete="off"
          className="relative w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          aria-label="Assignee"
          displayValue={(value: string | number) => getNameFromValue(value)}
          onChange={(event) => setQuery(event.target.value)}
        />{" "}
        <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
          <ChevronDown className="size-4 fill-black/60 group-data-[hover]:fill-black" />
        </ComboboxButton>
        <ComboboxOptions
          anchor="bottom"
          className={clsx(
            "z-9999 h-50 w-[var(--input-width)] overflow-hidden rounded border border-primary bg-white p-1 [--anchor-gap:var(--spacing-1)] empty:invisible",
            "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0",
          )}
        >
          {filteredPeople.map((data) => (
            <ComboboxOption
              key={data.value}
              value={data.value}
              className="fill-bg-white data-[focus]:bg-blue-100"
            >
              {data.name}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
}
