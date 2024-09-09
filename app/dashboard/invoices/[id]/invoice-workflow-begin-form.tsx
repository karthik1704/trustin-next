"use client";
import React, { useState, useEffect, ChangeEvent } from "react";

import SubmitButton from "@/components/submit-button/submit-button";

type Props = {
  actionData: (data: FormData) => void;

  assign: number;
  status?: string;
  status_id: number;
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
  assign,
  status = "",
  status_id,
  buttonName,
  currentStep,
  assigneeData = [],
  showComment = false,
  comment = "",
}: Props) {
  const [comments, setComments] = useState(comment);

  
 
  function handleCommentChange(event: ChangeEvent<HTMLTextAreaElement>): void {
      setComments(event.target.value)
    }

  return (
    <form action={actionData}>
      <div className="p-2.5">
        <input type="hidden" value={status} name="status" />
        <input type="hidden" value={status_id} name="status_id" />
        <input type="hidden" defaultValue={assign} name="assigned_to" />
     

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
         
        </div>
      </div>
    </form>
  );
}

export default WorkFlowForm;
