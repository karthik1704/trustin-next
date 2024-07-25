"use client";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogOverlay,
} from "@/components/ui/alert-dialog";
import { Checkbox, Field, Label } from "@headlessui/react";

type Props = {
  isLoading: boolean;
  isSubmitting: boolean;
  successButtonName: string;
  rejectLoading?: boolean;
  rejectFn?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  reject?: boolean;
};

function ConfrimDialog2({
  isLoading = false,
  isSubmitting,
  successButtonName,
  rejectLoading,
  rejectFn,
  reject = false,
}: Props) {
  const [enabled, setEnabled] = useState(false);

  return (
    <AlertDialog
     
    >
      {!reject ? (
        <AlertDialogTrigger
          className="flex w-1/2 justify-center rounded bg-primary p-3 font-medium text-gray disabled:bg-slate-500"
          disabled={isLoading || isSubmitting || rejectLoading}
        >
          {isLoading || isSubmitting ? "Loading..." : successButtonName}
        </AlertDialogTrigger>
      ) : (
        <AlertDialogTrigger
          className="flex w-1/2 justify-center rounded bg-danger p-3 font-medium text-gray disabled:bg-slate-500"
          disabled={rejectLoading || isSubmitting}
        >
          {rejectLoading ? "Loading..." : "Reject"}
        </AlertDialogTrigger>
      )}

      {/* <AlertDialogOverlay  /> */}
      <AlertDialogContent onEscapeKeyDown={()=>setEnabled(false)}>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Please select checkbox for consent to continue!...
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <Field className="flex items-center gap-2">
            <Checkbox
              checked={enabled}
              onChange={setEnabled}
              className="group block size-4 rounded border bg-white data-[checked]:bg-blue-500"
            >
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
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setEnabled(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            asChild
            className={reject ? "bg-destructive hover:bg-destructive/90" : ""}
          >
            {!reject ? (
              <button
                type="submit"
                className="flex w-1/2 justify-center rounded bg-primary p-3 font-medium text-gray disabled:bg-slate-500"
                disabled={!enabled || isSubmitting}
                form="workflow-form"
              >
                {isLoading || isSubmitting ? "Loading" : "Continue"}
              </button>
            ) : (
              <button
                onClick={rejectFn}
                type="button"
                className="flex w-1/2 justify-center rounded bg-danger p-3 font-medium text-gray disabled:bg-slate-500"
                disabled={!enabled || rejectLoading}
              >
                {rejectLoading ? "Loading..." : "Reject"}
              </button>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConfrimDialog2;
