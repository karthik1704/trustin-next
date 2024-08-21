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
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { pdf } from "@react-pdf/renderer";
import { sentMail } from "../actions";
import MyDocument from "@/components/Print/InvoicePDF";
import { Data } from "./typings";
import Select from "@/components/select-input";
import { toast } from "sonner";

type Props = {
  filename: string;
  pdf?: Blob | null;
  to?: string;
  data: Data;
  isDraft: boolean;
  qr: string;
};

type FormValues = {
  email: string;
  // to: string;
  // subject: string;
  // message: string;
  email_type: string;
  filename: string;
  attachment?: string;
};

type InitialState = {
  fieldErrors?: {} | null;
  type?: string | null;
  message?: any | string | null;
};

const initialState: InitialState = {
  fieldErrors: {},
  type: null,
  message: null,
};

function EmailPopup({ filename, data, qr, isDraft, to = "" }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="flex w-1/5 justify-center rounded bg-primary p-2 font-medium text-gray disabled:bg-slate-500"
        onClick={() => setIsOpen(true)}
      >
        {isDraft ? "Send Draft Mail" : "Send Mail"}
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
            <EmailForm
              filename={filename}
              data={data}
              qr={qr}
              isDraft={isDraft}
              to=""
            />
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

const EmailForm = ({ filename, data, isDraft, qr, to }: Props) => {
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: { email:to },
  });
  let close = useClose();
  const [state, setState] = useState<InitialState | undefined>(initialState);


  useEffect(() => {
    if (state?.type === null) return;

    if (state?.type === "Error") {
      toast.error(state?.message, {
        duration: 10000,
        closeButton: true,
      });
    }
    if (state?.type === "Success") {
      toast.success(state?.message, {
        duration: 10000,
        closeButton: true,
      });
      // router.push("/dashboard/samples");
    }
  }, [state]);

  const handleSubmission = async (formData: FormValues) => {
    const myPdf = pdf(
      MyDocument({ data, isDraft, qr, reportType: formData.email_type ==="ORIGINAL" ? "Original" : "Copy" }),
    ).toBlob();
  
    if (myPdf) {
      const pdfBlob = await myPdf;
      formData.attachment = await convertBlobToBase64(pdfBlob);
    }
    console.log(formData);
    const res = await sentMail(formData);
    setState(res);
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

        {/* <div className="mb-2.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Subject
          </label>
          <input
            type="text"
            {...register("subject")}
            placeholder="Subject"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div> */}

        {/* <div className="mb-2">
          <label className="mb-2.5 block text-black dark:text-white">
            Message
          </label>
          <textarea
            {...register("message")}
            rows={6}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          ></textarea>
        </div> */}
        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <Select name="email_type" register={register} label={"Report Type"}>
            {" "}
            {isDraft ? (
              <option value={"DRAFT"}>Draft</option>
            ) : (
              <>
                <option value={"ORIGINAL"}>Original</option>
                <option value={"COPY"}>Copy</option>
              </>
            )}
          </Select>
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
