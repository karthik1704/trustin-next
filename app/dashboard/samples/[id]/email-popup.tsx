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
  useClose,
} from "@headlessui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { sentMail } from "../actions";

type Props = {
  filename: string;
  pdf?: Blob | null;
  to?: string;
};

type FormValues = {
  email: string;
  to: string;
  subject: string;
  message: string;
  filename: string;
  attachment?: string;
};

function EmailPopup({ filename, pdf = null, to = "" }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="flex w-1/2 justify-center rounded bg-primary p-3 font-medium text-gray disabled:bg-slate-500"
        onClick={() => setIsOpen(true)}
      >
        Send Mail
      </button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-9999"
        role="dialog"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-2 shadow-5">
          <DialogPanel className="w-1/2 rounded-md border bg-white p-12">
            <DialogTitle className="font-bold">Compose Mail</DialogTitle>
            <Description>Send a mail with Report</Description>
            <EmailForm filename={filename} pdf={pdf} to="" />
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}

export default EmailPopup;

const convertBlobToBase64 = (blob: Blob | File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // The result is a data URL, so split to get the base64 part
      const base64data = reader.result?.toString().split(",")[1];
      if (base64data) {
        resolve(base64data);
      } else {
        reject(new Error("Failed to convert blob to base64"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const EmailForm = ({ filename, pdf, to }: Props) => {
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: { to },
  });
  let close = useClose();

  const handleSubmission = async (data: FormValues) => {
    if (pdf) {
      const pdfBlob = await pdf;
      data.attachment = await convertBlobToBase64(pdfBlob);
    }
    console.log(data);
    await sentMail(data);
    close();
  };
  return (
    <form onSubmit={handleSubmit(handleSubmission)} id="email-form">
      <div className="p-2.5">
        <div className="mb-2.5">
          <label className="mb-2.5 block text-black dark:text-white">To</label>
          <input
            type="email"
            {...register("email")}
            placeholder="to@gmail.com"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>

        <div className="mb-2.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Subject
          </label>
          <input
            type="text"
            {...register("subject")}
            placeholder="Subject"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>

        <div className="mb-2">
          <label className="mb-2.5 block text-black dark:text-white">
            Message
          </label>
          <textarea
            {...register("message")}
            rows={6}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          ></textarea>
        </div>
      </div>

      <input type="hidden" value={filename} {...register("filename")} />

      <div className="flex gap-4">
        <button
          className="flex w-1/2 justify-center rounded border-2 border-slate-600 p-3 font-medium text-black hover:border-red-600 hover:text-slate-700 disabled:bg-slate-500"
          onClick={close}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="flex w-1/2 justify-center rounded bg-primary p-3 font-medium text-gray disabled:bg-slate-500"
        >
          Send Mail
        </button>
      </div>
    </form>
  );
};
