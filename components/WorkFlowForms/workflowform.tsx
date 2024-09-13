"use client";
import React, { useState, useEffect } from "react";
import Select from "../select-input";
import SubmitButton from "../submit-button/submit-button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  actionData: (data: FormData) => void;
  rejectActionData: (
    data: any,
  ) => Promise<
    { fieldErrors: null; type: string; message: string | undefined } | undefined
  >;
  showRejectButton?: boolean;
  assign: number;
  status?: string;
  status_id: number;
  test_type_id: number;
  currentStep: number;
  comment?: string;
  buttonName: string;
  assigneeData?: { id: number; first_name: string; last_name: string }[] | [];
  showComment?: boolean;
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
function WorkFlowForm({
  actionData,
  rejectActionData,
  showRejectButton = false,
  assign,
  status = "",
  status_id,
  test_type_id,
  buttonName,
  currentStep,
  assigneeData = [],
  showComment = false,
  comment = "",
}: Props) {
  const [comments, setComments] = useState(comment);
  const [loading, setLoading] = useState(false);

  const [rejectState, setRejectState] = useState<InitialState | undefined>(
    initialState,
  );
  const router = useRouter();

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComments(e?.target?.value);
  };

  useEffect(() => {
    if (rejectState?.type === null) return;

    if (rejectState?.type === "Error") {
      toast.error(rejectState?.message, {
        duration: 10000,
        closeButton: true,
      });
      setLoading(false);
    }
    if (rejectState?.type === "Success") {
      toast.success(rejectState?.message, {
        duration: 10000,
        closeButton: true,
      });
      setLoading(false);
      router.push("/dashboard/samples");
    }
  }, [rejectState, router]);

  const handleReject = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    const res = await rejectActionData({
      status: status,
      status_id: currentStep === 2 ? 1 : currentStep - 1,
      test_type_id:test_type_id,
      assigned_to: assign,
      comments: comments,
      test_params: [],
      testing_start_date: "",
      testing_end_date: "",
    });
    setRejectState(res);
  };
  console.log(status);
  return (
    <form action={actionData}>
      <div className="p-2.5">
        <input type="hidden" value={status} name="status" />
        <input type="hidden" value={status_id} name="status_id" />
        <input type="hidden" value={test_type_id} name="test_type_id" />
        <input type="hidden" defaultValue={assign} name="assigned_to" />
        {/* {currentStep === 4 ? (
          <>
            <div className="mb-6">
              <label className="mb-2.5 block text-black dark:text-white">
                Comments
              </label>
              <input
                type="date"
                name="testing_start_date"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />{" "}
            </div>
            <div className="mb-6">
              <label className="mb-2.5 block text-black dark:text-white">
                Comments
              </label>
              <input
                type="date"
                name="testing_end_date"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />{" "}
            </div>
          </>
        ) : (
          <div>
            <input type="hidden" defaultValue={""} name="testing_start_date" />
            <input type="hidden" defaultValue={""} name="testing_end_date" />
          </div>
        )} */}

        {showComment ? (
          <div className="mb-6">
            <label className="mb-2.5 block text-black dark:text-white">
              Comments
            </label>
            <textarea
              rows={3}
              name="comments"
              required
              onChange={handleCommentChange}
              defaultValue={comments}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            ></textarea>{" "}
          </div>
        ) : (
          <input type="hidden" value={comment} name="comments" />
        )}
        <div className="flex gap-2 justify-center ">
          <SubmitButton name={buttonName} width="w-1/2" />
          {showRejectButton && (
            <button
              onClick={handleReject}
              type="button"
              className="flex w-1/2 justify-center rounded bg-danger p-3 font-medium text-gray disabled:bg-slate-500"
              disabled={loading}
            >
              {loading ? "Loading..." : "Reject"}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

export default WorkFlowForm;
