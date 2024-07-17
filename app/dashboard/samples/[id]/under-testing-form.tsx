"use client";
import Select from "@/components/select-input";
import React from "react";
import { useFieldArray, useForm, Form } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Data } from "./page";

type Parameters = [
  {
    id: number;
    sample_id: number;
    test_parameter_id: number;
    test_type: string;
    value: string;
    result: boolean;
    order: number;
    quantity: number | null;

    created_by: number;
    updated_by: number;

    test_parameter: {
      id: number;
      branch_id: number;
      test_type_id: number;
      product_id: number;
      customer_id: number;
      created_at: "2024-03-10T08:14:48.411Z";
      updated_at: "2024-03-10T08:14:48.411Z";
      parameter_code: string;
      testing_parameters: string;
      amount: number;
      method_or_spec: string;
      group_of_test_parameters: string;
    };
  },
];

type Props = {
  showRejectButton?: boolean;
  parameters: Parameters;
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
  assigneeData?: { id: number; first_name: string; last_name: string }[] | [];
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
  parameters,
  patchFn,
  assigned_to,
  step,
  currentStep,
  buttonName = "Submit",
  comment = "",
  showRejectButton = false,
  rejectActionData,
  assigneeData,
  data,
}: Props) => {
  const {
    control,
    register,
    getValues,
    formState: { isLoading, isSubmitting },
    handleSubmit,
  } = useForm({
    defaultValues: {
      status: "",
      status_id: step,
      assigned_to,
      comments: comment,
      nabl_logo: data.sample.nabl_logo ? 1 : 0,
      under_cdsco: data.sample.under_cdsco ? 1 : 0,
      testing_start_date: data?.sample?.testing_start_date
        ? new Date(data?.sample?.testing_start_date).toISOString().split("T")[0]
        : "",
      testing_end_date: data?.sample?.testing_end_date
        ? new Date(data.sample.testing_end_date).toISOString().split("T")[0]
        : "",
      test_params: parameters.map((para) => ({
        id: para.id,
        value: para.value ?? "",
        order: para.order,
        quantity: para.quantity,
        result: para.result ? 1 : 0,
        test_name: para.test_parameter.testing_parameters,
      })),
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "test_params",
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
      router.push("/dashboard/samples");
    }
  }, [state, router]);

  const handleReject = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    console.log(getValues());
    const { comments, test_params } = getValues();
    const res = await rejectActionData({
      status: "",
      status_id: currentStep === 2 ? 2 : currentStep - 1,
      assigned_to: assigned_to,
      comments: comments,
      test_params: test_params,
    });

    setState(res);
  };
  // console.log(isLoading, isSubmitting)
  //   if (isLoading || isSubmitting){
  //     return(
  //       <Loader bg="bg-transparent z-20"/>
  //     )
  //   }

  return (
    <form onSubmit={handleSubmit(handleForm)} className="p-2">
      <input type="hidden" {...register("status")} />
      <input type="hidden" {...register("status_id")} />
      {currentStep === 4 && (
        <>
          <div className="mb-6">
            <label className="mb-2.5 block text-black dark:text-white">
              Testing Start Date
            </label>
            <input
              type="date"
              {...register("testing_start_date")}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />{" "}
          </div>
          <div className="mb-6">
            <label className="mb-2.5 block text-black dark:text-white">
              Testing End Date
            </label>
            <input
              type="date"
              {...register("testing_end_date")}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />{" "}
          </div>
        </>
      )}
      {currentStep === 2 && (
        <>
          <Select
            label={"Test parameters under NABL Scope"}
            name={`nabl_logo`}
            register={register}
          >
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </Select>
          <Select
            label={"Test parameters under CDSCO"}
            name={`under_cdsco`}
            register={register}
          >
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </Select>
          <Select name="assigned_to" label="assignee">
            {assigneeData?.map((assignee) => (
              <option value={assignee.id} key={assignee.id}>
                {assignee.first_name + assignee.last_name}
              </option>
            ))}
          </Select>{" "}
        </>
      )}
      <div className="mb-6">
        <label className="mb-2.5 block text-black dark:text-white">
          Comments
        </label>
        <textarea
          rows={3}
          {...register("comments")}
          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
        ></textarea>{" "}
      </div>
      <div className="m-1 mb-5 rounded-sm border border-stroke bg-white px-2 pb-2.5 pt-2 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-3.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-gray-2 p-2 text-left dark:bg-meta-4">
                <th className="w-[30px] font-medium text-black dark:text-white">
                  S.NO
                </th>
                <th className="w-1/5 font-medium text-black dark:text-white">
                  Test Parameter Name
                </th>
                <th className="w-1/5 font-medium text-black dark:text-white">
                  Order
                </th>
                <th className="w-[100px] font-medium text-black dark:text-white">
                  Amount of samples
                </th>
                {currentStep !== 2 && (
                  <>
                    <th className="w-1/5 font-medium text-black dark:text-white">
                      Value
                    </th>
                    <th className="w-1/5 font-medium text-black dark:text-white">
                      Result
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {fields.map((item, index) => (
                <tr key={item.id}>
                  <td className="w-[30px] border-b border-[#eee] dark:border-strokedark">
                    <h5 className="w-[30px] font-medium text-black dark:text-white">
                      {index + 1}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] dark:border-strokedark">
                    <input
                      type="text"
                      {...register(`test_params.${index}.test_name`)}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-2 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      disabled
                    />
                  </td>
                  <td className="border-b border-[#eee] px-2 dark:border-strokedark">
                    <input
                      type="text"
                      {...register(`test_params.${index}.order`)}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-2 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </td>
                  <td className="border-b border-[#eee] px-2 dark:border-strokedark">
                    <input
                      type="number"
                      {...register(`test_params.${index}.quantity`)}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-2 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </td>
                  {currentStep !== 2 && (
                    <>
                      <td className="border-b border-[#eee] px-2 dark:border-strokedark">
                        <input
                          type="text"
                          {...register(`test_params.${index}.value`)}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-2 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                      </td>
                      <td className="border-b border-[#eee] px-2 dark:border-strokedark">
                        <Select
                          label={null}
                          name={`test_params.${index}.result`}
                          register={register}
                        >
                          <option value={1}>Pass</option>
                          <option value={0}>Fail</option>
                        </Select>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex w-1/2 justify-center rounded bg-primary p-3 font-medium text-gray disabled:bg-slate-500"
          disabled={isLoading || isSubmitting}
        >
          {isLoading || isSubmitting ? "Loading..." : buttonName}
        </button>

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
    </form>
  );
};

export default UnderTestingForm;
