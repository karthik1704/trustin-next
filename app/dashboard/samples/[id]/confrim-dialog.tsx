"use client";
import {
  Checkbox,
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Field,
  Label,
} from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/16/solid";
import { useState } from "react";

function ConfrimDialog({ isLoading = false, submitButtonName = "Submit" }) {
  let [isOpen, setIsOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open dialog</button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 shadow-5">
          <DialogPanel className="min-w-115 space-y-4 rounded-md border bg-white p-12">
            <DialogTitle className="font-bold">Are you Sure?</DialogTitle>
            <Description>Please select checkbox for consent to continue!...</Description>
            <div>
              <Field className="flex items-center gap-2">
                <Checkbox
                  checked={enabled}
                  onChange={setEnabled}
                  className="group block size-4 rounded border bg-white data-[checked]:bg-blue-500"
                >
                  {/* Checkmark icon */}
                  {/* <CheckIcon className="hidden size-4 fill-black group-data-[checked]:block" /> */}

                  <svg
                    className="stroke-white opacity-0 group-data-[checked]:opacity-100"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      d="M3 8L6 11L11 3.5"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Checkbox>
                <Label>I Confrim</Label>
              </Field>
            </div>
            <div className="flex gap-4">
              <button
                className="flex w-1/2 justify-center rounded border-slate-600 border-2 p-3 font-medium text-black hover:border-red-600 hover:text-slate-700 disabled:bg-slate-500"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex w-1/2 justify-center rounded bg-primary p-3 font-medium text-gray disabled:bg-slate-500"
                disabled={isLoading || !enabled}
              >
                {isLoading ? "Loading..." : "Continue"}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}

export default ConfrimDialog;
