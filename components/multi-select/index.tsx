import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import clsx from "clsx";
import { Controller, useFormContext } from "react-hook-form";
import { Check } from "lucide-react";

type Data = {
  name: string;
  value: string | number;
};

type Props = {
  data: Data[];
  name: string;
  disabled?: boolean;
  control: any;
};

function MultiSelect({ data, name, control, disabled = false }: Props) {
  return (
    <div className="w-full">
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Listbox
            value={value}
            onChange={onChange}
            multiple
            disabled={disabled}
          >
            <ListboxButton
              className={clsx(
                "w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 text-left outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary",
              )}
            >
              {value
                ?.map(
                  (v: string | number) => data.find((d) => d.value === v)?.name,
                )
                .join(", ") || "Select..."}
            </ListboxButton>
            <ListboxOptions
              anchor="bottom"
              className={clsx(
                "w-[var(--button-width)] border border-b bg-white p-1 [--anchor-gap:var(--spacing-1)] focus:outline-none",
                "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0",
              )}
            >
              {data.map((item) => (
                <ListboxOption
                  key={item.value}
                  value={item.value}
                  className="bg-white p-1 data-[focus]:bg-blue-100 flex items-center gap-2"
                >
                  <div className="flex items-center gap-2">
                    {value?.includes(item.value) && (
                      <Check className="size-4 fill-white" />
                    )}
                    <span>{item.name}</span>
                  </div>
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Listbox>
        )}
      />
    </div>
  );
}

export default MultiSelect;
