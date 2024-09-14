"use client";
import Select from "@/components/select-input";
import React, { useState } from "react";
import { useFieldArray, useForm, Form } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Data } from "./typings";
import ConfrimDialog2 from "@/components/confrim-dialog/confrim-dialog";
import { User } from "@/types/user";
import EmailPopup from "./email-popup";
import { standards } from "@/app/constant";
import { ArrowRightLeft } from "lucide-react";

type Parameters = {
  unit: string;
  min_limits: string;
  max_limits: string;
  id: number;
  sample_id: number;
  test_parameter_id: number;
  test_type: string;
  value: string;
  specification_limits: string;
  result: boolean;
  order: number;
  quantity: number | null;

  created_by: number;
  updated_by: number;

  test_parameter: {
    max_limits: string;
    min_limits: string;
    specification_limits: string;
    id: number;
    branch_id: number;
    test_type_id: number;
    product_id: number;
    customer_id: number;
    created_at: string;
    updated_at: string;
    parameter_code: string;
    testing_parameters: string;
    amount: number;
    method_or_spec: string;
    group_of_test_parameters: string;
  };
}[];

type Props = {
  showRejectButton?: boolean;
  data: Data;
  patchFn: (
    data: any,
  ) => Promise<
    { fieldErrors: null; type: string; message: string | undefined } | undefined
  >;
  rejectActionData: (
    data: any,
  ) => Promise<
    { fieldErrors: null; type: string; message: string | undefined } | undefined
  >;
  assigned_to: number;
  step: number;
  buttonName?: string;
  comment?: string;
  currentStep: number;
  assigneeData?:
    | {
        qa_type_id: number;
        role_id: number;
        id: number;
        first_name: string;
        last_name: string;
      }[]
    | [];
  openModal?: () => void;
  signUsers?: User[];
  qr?: string | null;
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

const UnderTestingForm = ({
  patchFn,
  assigned_to,
  step,
  currentStep,
  buttonName = "Submit",
  comment = "",
  showRejectButton = false,
  rejectActionData,
  data,

  openModal,
  signUsers,
  qr = null,
}: Props) => {
  const {
    control,
    register,
    getValues,
    formState: { isLoading, isSubmitting },
    handleSubmit,
    setValue,
  } = useForm({
    defaultValues: {
      status: "",
      status_id: step,
      // assigned_to: data?.currentUser?.id ?? "",

      comments: comment,
      ...(currentStep == 2 && {
        authorized_sign_id: data.currentUser?.id ?? "",
      }),
      ...(currentStep == 3 && {
        lut_arn: data.invoice?.lut_arn ?? "",
        note: data.invoice?.note ?? "",
      }),
    },
  });

  const [loading, setLoading] = React.useState(false);
  const [state, setState] = React.useState<InitialState | undefined>(
    initialState,
  );
  const router = useRouter();

  const handleForm = async (data: {}) => {
    console.log(data);
    const res = await patchFn(data);
    setState(res);
  };

  React.useEffect(() => {
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
      router.push("/dashboard/invoices");
    }
  }, [state, router]);

  const handleReject = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    console.log(getValues());
    const { comments } = getValues();

    if (!comments) {
      toast.error("Comments is required", {
        duration: 10000,
        closeButton: true,
      });
      setLoading(false);
      return;
    }

    const res = await rejectActionData({
      status: "",
      status_id: currentStep === 2 ? 1 : currentStep - 1,
      assigned_to: data.currentUser?.id,
      comments: comments,
    });

    setState(res);
  };

  const permissionsDisable: { [key: number]: boolean } = {
    2:
        data.currentUser?.role_id !== 2 &&
      ![1, 2].includes(data.currentUser?.department_id ?? 0),
    3:
        data.currentUser?.role_id !== 5 &&
      ![1, 2].includes(data.currentUser?.department_id ?? 0),
    4:
      data.currentUser?.role_id !== 5 &&
        ![1, 2].includes(data.currentUser?.department_id ?? 0),
  };

  return (
    <div>
      {currentStep === 2 && (
        <div className="align-items:flex-end flex flex-col items-end gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => openModal && openModal()}
            className="align-items: flex-end m-1 justify-center rounded bg-primary p-2 font-medium text-gray"
          >
            Preview
          </button>
        </div>
      )}

      {[3].includes(currentStep) && (
        <div className="align-items:flex-end flex flex-col items-end gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => openModal && openModal()}
            className="flex w-1/6 justify-center rounded bg-primary p-2 font-medium text-gray disabled:bg-slate-500"
          >
            Print Draft
          </button>
          {/* {currentStep === 8 && (
            <EmailPopup
              filename={data.sample.sample_id}
              data={data}
              qr={qr ? qr : ""}
              isDraft={currentStep === 8 ? true : false}
              to={data.sample.registration.contact_email}
            />
          )} */}
        </div>
      )}

      <form
        id={"invoice-workflow-form"}
        onSubmit={handleSubmit(handleForm)}
        className="p-2"
      >
        <input type="hidden" {...register("status")} />
        <input type="hidden" {...register("status_id")} />

        {currentStep === 2 && (
         
       
            <input
              type="hidden"
              {...register("authorized_sign_id")}
              
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          )}

        {currentStep === 3 && (<>
          {data.invoice.invoice_type === "USD" ? (
          <div className="mb-6">
            <label className="mb-2.5 block text-black dark:text-white">
              LUT ARN
            </label>
            <input
              type="text"
              {...register("lut_arn")}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>):<input type="hidden" {...register("lut_arn")} value=""/>}
          <div className="mb-6">
            <label className="mb-2.5 block text-black dark:text-white">
              Notes
            </label>
            <input
              type="text"
              {...register("note")}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
          </>
        )}
      

    
  
        <div className="mb-6">
          <label className="mb-2.5 block text-black dark:text-white">
            Comments
          </label>
          <textarea
            rows={3}
            required
            {...register("comments")}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          ></textarea>{" "}
        </div>
      
        <div className="flex gap-2">
          
          <ConfrimDialog2
            formName={
              "invoice-workflow-form" 
            }
            successButtonName={buttonName}
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            rejectLoading={loading}
            isDisable={permissionsDisable[currentStep]}
          />
          {showRejectButton && (
            <ConfrimDialog2
            formName={
              "invoice-workflow-form" 
            }
              successButtonName={buttonName}
              isLoading={isLoading}
              isSubmitting={isSubmitting}
              rejectLoading={loading}
              rejectFn={handleReject}
              reject
              isDisable={permissionsDisable[currentStep]}
            />
          )}

  
        </div>
      </form>
    </div>
  );
};

export default UnderTestingForm;
