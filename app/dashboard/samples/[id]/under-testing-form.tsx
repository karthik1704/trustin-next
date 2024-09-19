"use client";
import Select from "@/components/select-input";
import React, { useState } from "react";
import { useFieldArray, useForm, Form } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Data, SampleDetailSchema } from "./typings";
import ConfrimDialog from "./confrim-dialog";
import ConfrimDialog2 from "./confrim-dialog2";
import { User } from "@/types/user";
import EmailPopup from "./email-popup";
import { standards } from "@/app/constant";
import { ArrowRightLeft } from "lucide-react";
import MultiSelect from "@/components/multi-select";

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
  parameters: Parameters;
  data: Data;
  formData: SampleDetailSchema | undefined;
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
  test_type_id: number;
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
  openModal?: (type: string) => void;
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
  test_type_id,
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
  formData,

  openModal,
  signUsers,
  qr = null,
}: Props) => {
  console.log("hey", formData);
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
      assigned_to: formData?.assigned_to ?? "",
      test_type_id: test_type_id,
      ...(currentStep == 2 && {
        nabl_logo: data.sample.nabl_logo ? 1 : 0,
        under_cdsco: data.sample.under_cdsco ? 1 : 0,
        discipline:
          data.sample?.sample_test_types.length === 2
            ? "Biological and Mechanical"
            : test_type_id === 1
              ? "Biological"
              : "Mechanical",
        // group: formData?.group,
      }),
      comments: comment,
      ...(currentStep == 3 && {
        issued_to: formData?.issued_to ?? "",
        sample_issued: formData?.sample_issued ?? "",
      }),
      ...(currentStep == 4 && {
        samples_received: formData?.samples_received ? 1 : 0,
      }),
      ...(currentStep === 5 && {
        testing_start_date: formData?.testing_start_date
          ? new Date(formData?.testing_start_date).toISOString().split("T")[0]
          : "",
        testing_end_date: formData?.testing_end_date
          ? new Date(formData.testing_end_date).toISOString().split("T")[0]
          : "",
      }),
      ...(currentStep === 7 && {
        show_status_report: data?.sample?.show_status_report ? 1 : 0,
      }),
      ...(currentStep === 8 && {
        authorized_sign_id: formData?.authorized_sign_id,
        abbreviations: data.sample?.abbreviations ?? [],
        statement_of_conformity: data.sample.statement_of_conformity ?? "",
        reason: data.sample.reason ?? "",
      }),
      ...(currentStep === 9 && {
        sign_verified: formData?.sign_verified ? 1 : 0,
        authorized_sign_date: formData?.authorized_sign_date
          ? new Date(formData?.authorized_sign_date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      }),

      test_params: parameters.map((para) => ({
        id: para.id,
        order: para.order,
        quantity: para.quantity,
        unit: para.unit,
        test_name: para.test_parameter.testing_parameters,

        ...(currentStep === 5 && {
          ...(test_type_id === 1
            ? {
                specification_limits:
                  para.specification_limits ??
                  para.test_parameter.specification_limits,
              }
            : {
                specification_limits:
                  para.specification_limits ??
                  para.test_parameter.specification_limits,
                min_limits: para.min_limits ?? para.test_parameter.min_limits,
                max_limits: para.max_limits ?? para.test_parameter.max_limits,
              }),
          value: para.value ?? "",
          result: para.result ? 1 : 0,
        }),
      })),
    },
  });
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "test_params",
  });

  const [showSpec, setShowSpec] = useState<boolean[]>(
    parameters.map((para) => (para.specification_limits ? true : false)),
  );

  const handleShowSpec = (idx: number): void => {
    // update(idx, { min_limits: undefined });
    // update(idx, { max_limits: undefined });
    // update(idx, { specification_limits: undefined });
    setValue(`test_params.${idx}.min_limits`, undefined as any);
    setValue(`test_params.${idx}.max_limits`, undefined as any);
    setValue(`test_params.${idx}.specification_limits`, undefined as any);
    setShowSpec((prevState) =>
      prevState.map((value, i) => (i === idx ? !value : value)),
    );
  };

  const [loading, setLoading] = React.useState(false);
  const [state, setState] = React.useState<InitialState | undefined>(
    initialState,
  );
  const router = useRouter();

  const handleForm = async (data: {}) => {
    console.log("form data", data);
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
      test_type_id: test_type_id,
      assigned_to: formData?.assigned_to,
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

  const permissionsDisable: { [key: number]: boolean } = {
    2:
      data.currentUser.role_id !== 3 &&
      ![1, 2].includes(data.currentUser.department_id),
    3:
      data.currentUser.role_id !== 8 &&
      ![1, 2].includes(data.currentUser.department_id),
    4:
      data.currentUser.role_id !== 4 &&
      ![1, 2].includes(data.currentUser.department_id),
    5:
      data.currentUser.role_id !== 4 &&
      ![1, 2].includes(data.currentUser.department_id),
    6:
      data.currentUser.role_id !== 3 &&
      ![1, 2].includes(data.currentUser.department_id),
    7:
      data.currentUser.role_id !== 9 &&
      ![1, 2].includes(data.currentUser.department_id),
    8:
      data.currentUser.role_id !== 10 &&
      ![1, 2].includes(data.currentUser.department_id),
    9:
      ![1, 2].includes(data.currentUser.department_id) &&
      data.currentUser.id !== formData?.authorized_sign_id,
  };

  return (
    <div>
      {currentStep === 7 && (
        <div className="align-items:flex-end flex flex-col items-end gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => openModal && openModal("Preview")}
            className="align-items: flex-end m-1 justify-center rounded bg-primary p-2 font-medium text-gray"
          >
            Preview
          </button>
        </div>
      )}

      {[8, 9].includes(currentStep) && (
        <div className="align-items:flex-end flex flex-col items-end gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => openModal && openModal("Draft")}
            className="flex w-1/6 justify-center rounded bg-primary p-2 font-medium text-gray disabled:bg-slate-500"
          >
            Print Draft
          </button>
          {currentStep === 8 && (
            <EmailPopup
              filename={data.sample.sample_id}
              data={data}
              qr={qr ? qr : ""}
              isDraft={currentStep === 8 ? true : false}
              to={data.sample.registration.contact_email}
            />
          )}
        </div>
      )}

      <form
        id={test_type_id === 1 ? "micro-workflow-form" : "mech-workflow-form"}
        onSubmit={handleSubmit(handleForm)}
        className="p-2"
      >
        <input type="hidden" {...register("status")} />
        <input type="hidden" {...register("test_type_id")} />
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
            <Select
              name="assigned_to"
              label="assignee"
              register={register}
              required
            >
              {assigneeData
                ?.filter((assignee) => assignee.qa_type_id === test_type_id)
                .map((assignee) => (
                  <option value={assignee.id} key={assignee.id}>
                    {assignee.first_name + " " + assignee.last_name}
                  </option>
                ))}
            </Select>{" "}
            {/* <div className="mb-6">
              <label className="mb-2.5 block text-black dark:text-white">
                Group
              </label>
              <input
                type="text"
                {...register("group")}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />{" "}
            </div> */}
            <div className="mb-6">
              <label className="mb-2.5 block text-black dark:text-white">
                Discipline
              </label>
              <input
                readOnly
                type="text"
                {...register("discipline")}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />{" "}
            </div>
          </>
        )}
        {currentStep === 3 && (
          <>
            <div className="mb-6">
              <label className="mb-2.5 block text-black dark:text-white">
                No. of samples issued
              </label>
              <input
                type="number"
                {...register("sample_issued")}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />{" "}
            </div>
            <div className="mb-6">
              <label className="mb-2.5 block text-black dark:text-white">
                Issued to
              </label>
              <input
                type="text"
                {...register("issued_to")}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />{" "}
            </div>
          </>
        )}
        {currentStep === 4 && (
          <>
            <Select
              label={"Samples Received"}
              name={`samples_received`}
              register={register}
            >
              <option value={0}> No </option>
              <option value={1}> Yes </option>
            </Select>
          </>
        )}

        {currentStep === 5 && (
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
        {currentStep === 7 ? (
          <>
            <Select label={"Status"} name={`status_id`} register={register}>
              <option value={step}> Move to Next </option>
              <option value={1}> Registered </option>
              <option value={2}>
                Under review and Sample requested (HOD){" "}
              </option>
              <option value={3}>Under Registration team (Sample issue)</option>
              <option value={4}>Sample Received </option>
              <option value={5}>Under Testing </option>
              <option value={6}>Under QC Review </option>
            </Select>
            <Select
              label={"Show Status in Report"}
              name={`show_status_report`}
              register={register}
            >
              <option value={0}> No</option>
              <option value={1}> Yes </option>
            </Select>
          </>
        ) : (
          <input type="hidden" {...register("status_id")} />
        )}
        {currentStep === 8 && (
          <>
            <Select
              name="authorized_sign_id"
              label="Authorized Sign"
              register={register}
            >
              {signUsers?.map((assignee) => (
                <option value={assignee.id} key={assignee.id}>
                  {assignee.first_name + " " + assignee.last_name}
                </option>
              ))}
            </Select>
            <div className="mb-6">
              <label className="mb-2.5 block text-black dark:text-white">
                Reason
              </label>
              <input
                type="text"
                {...register("reason")}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />{" "}
            </div>
            <div className="mb-6">
              <label className="mb-2.5 block text-black dark:text-white">
                Statement of confirmity
              </label>
              <input
                type="text"
                {...register("statement_of_conformity")}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />{" "}
            </div>

            {/* <Select
              name="abbreviations"
              label="Abbreviations"
              register={register}
            >
              {Object.entries(standards).map(([abbr, fullName]) => (
                <option value={abbr} key={abbr}>
                  {fullName}
                </option>
              ))}
            </Select> */}
            <div className="mb-6">
              <label className="mb-2.5 block text-black dark:text-white">
                Abbreviations
              </label>
              <MultiSelect
                name="abbreviations"
                control={control}
                data={Object.entries(standards).map(([abbr, fullName]) => ({
                  value: abbr,
                  name: fullName,
                }))}
              />
            </div>
          </>
        )}
        {currentStep === 9 && (
          <>
            <Select
              label={"Verify Your Sign"}
              name={`sign_verified`}
              register={register}
            >
              <option value={0}> No </option>
              <option value={1}> Yes </option>
            </Select>
            <div className="mb-6">
              <label className="mb-2.5 block text-black dark:text-white">
                Signed Date
              </label>
              <input
                type="date"
                readOnly
                {...register("authorized_sign_date")}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />{" "}
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
        <div className="m-1 mb-5 rounded-sm border border-stroke bg-white px-2 pb-2.5 pt-2 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-3.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-fixed">
              <thead>
                <tr className="bg-gray-2 p-2 text-left dark:bg-meta-4">
                  <th className="w-[40px] pr-2 text-sm font-medium text-black dark:text-white">
                    S.No.
                  </th>
                  <th className="min-w-[320px] pl-2 text-sm font-medium text-black dark:text-white">
                    Test Parameter Name
                  </th>
                  <th className="w-[100px] pl-2 text-sm font-medium text-black dark:text-white">
                    Unit
                  </th>
                  <th className="min-w-[100px] text-sm font-medium text-black dark:text-white">
                    Order
                  </th>
                  <th className="min-w-[100px] text-sm font-medium text-black dark:text-white">
                    Amt of samples
                  </th>
                  {currentStep >= 5 && (
                    <>
                      <th className="min-w-[100px] text-sm font-medium text-black dark:text-white">
                        Specification Limits
                      </th>
                      {currentStep === 5 && (
                        <th className="w-[100px] text-sm font-medium text-black dark:text-white">
                          Switch
                        </th>
                      )}
                      <th className="w-1/5 text-sm font-medium text-black dark:text-white">
                        Result Obtained
                      </th>

                      <th className="w-[120px] text-sm font-medium text-black dark:text-white">
                        Status
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              {currentStep <= 5 ? (
                <tbody>
                  {fields.map((item, index) => (
                    <tr key={item.id}>
                      <td className="w-[40px] border-b border-[#eee] dark:border-strokedark">
                        <h5 className="w-[40px] text-sm font-medium text-black dark:text-white">
                          {index + 1}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] pl-2 dark:border-strokedark">
                        <input
                          type="hidden"
                          {...register(`test_params.${index}.test_name`)}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-2 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                          disabled
                        />
                        <p className="text-sm">{item.test_name}</p>
                      </td>
                      <td className="border-b border-[#eee] px-2 dark:border-strokedark">
                        <input
                          type="text"
                          required
                          {...register(`test_params.${index}.unit`)}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-2 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                      </td>
                      <td className="border-b border-[#eee] px-2 dark:border-strokedark">
                        <input
                          type="text"
                          required
                          {...register(`test_params.${index}.order`)}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-2 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                      </td>
                      <td className="border-b border-[#eee] px-2 dark:border-strokedark">
                        <input
                          type="number"
                          required
                          {...register(`test_params.${index}.quantity`)}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-2 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                      </td>
                      {currentStep === 5 && (
                        <>
                          <td className="border-b border-[#eee] px-2 dark:border-strokedark">
                            {test_type_id === 1 ? (
                              <input
                                type="text"
                                required
                                {...register(
                                  `test_params.${index}.specification_limits`,
                                )}
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-2 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                              />
                            ) : (
                              <>
                                {showSpec[index] ? (
                                  <input
                                    type="text"
                                    required
                                    {...register(
                                      `test_params.${index}.specification_limits`,
                                    )}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-2 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                  />
                                ) : (
                                  <div className="flex gap-2">
                                    <div>
                                      <label>Min</label>
                                      <input
                                        type="text"
                                        required
                                        {...register(
                                          `test_params.${index}.min_limits`,
                                        )}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-2 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                      />
                                    </div>
                                    <div>
                                      <label>Max</label>
                                      <input
                                        type="text"
                                        required
                                        {...register(
                                          `test_params.${index}.max_limits`,
                                        )}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-2 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                      />
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                          </td>

                          <td className="border-b border-[#eee] px-2 dark:border-strokedark">
                            <button
                              type="button"
                              onClick={() => handleShowSpec(index)}
                              className="hover:bg-gray-300 focus:ring-gray-400 active:bg-gray-400 transform rounded-full bg-transparent p-2 transition-transform duration-300 ease-in-out focus:outline-none focus:ring-2 disabled:text-slate-200"
                              disabled={test_type_id === 1}
                            >
                              <ArrowRightLeft />
                            </button>
                          </td>
                          <td className="border-b border-[#eee] px-2 dark:border-strokedark">
                            <input
                              type="text"
                              required
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
              ) : (
                <tbody>
                  {parameters.map((item, index) => (
                    <tr key={item.id} className="mt-4 p-6 font-medium">
                      <td className="w-[40px] border-b border-[#eee] dark:border-strokedark">
                        <h5 className="w-[40px] text-sm font-medium text-black dark:text-white">
                          {index + 1}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] pl-2 dark:border-strokedark">
                        <p className="mb-2.5 block py-3 text-sm font-semibold text-black dark:text-white">
                          {item.test_parameter.testing_parameters}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] pl-2 dark:border-strokedark">
                        <p className="mb-2.5 block py-3 text-sm font-semibold text-black dark:text-white">
                          {item.unit}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] px-2 dark:border-strokedark">
                        <p className="mb-2.5 block py-3 text-sm font-semibold text-black dark:text-white">
                          {item.order}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] px-2 dark:border-strokedark">
                        <p className="mb-2.5 block py-3 text-sm font-semibold text-black dark:text-white">
                          {item.quantity}
                        </p>
                      </td>

                      <td className="border-b border-[#eee] px-2 dark:border-strokedark">
                        {test_type_id === 1 ? (
                          <p className="mb-2.5 block py-3 text-sm font-semibold text-black dark:text-white">
                            {item.specification_limits}
                          </p>
                        ) : item.specification_limits ? (
                          <p className="mb-2.5 block py-3 text-sm font-semibold text-black dark:text-white">
                            {item.specification_limits}
                          </p>
                        ) : (
                          <>
                            <p className="mb-2.5 block py-3 text-sm font-semibold text-black dark:text-white">
                              <span>Min:-</span> {item.min_limits}
                            </p>
                            <p className="mb-2.5 block py-3 text-sm font-semibold text-black dark:text-white">
                              <span>Max:-</span>
                              {item.max_limits}
                            </p>
                          </>
                        )}
                      </td>
                      <td className="border-b border-[#eee] px-2 dark:border-strokedark">
                        <p className="mb-2.5 block py-3 text-sm font-semibold text-black dark:text-white">
                          {item.value}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] px-2 text-sm dark:border-strokedark">
                        <p
                          className={`mb-2.5 block py-3 text-sm font-semibold ${
                            item.result ? "text-green-700" : "text-red-700"
                          }`}
                        >
                          {item.result ? "Pass" : "Fail"}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </div>
        <div className="flex gap-2">
          {/* <ConfrimDialog
          successButtonName={buttonName}
          isLoading={isLoading}
          isSubmitting={isSubmitting}
          formName="workflow-form"
        /> */}
          <ConfrimDialog2
            formName={
              test_type_id === 1 ? "micro-workflow-form" : "mech-workflow-form"
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
                test_type_id === 1
                  ? "micro-workflow-form"
                  : "mech-workflow-form"
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

          {/* <button
          type="submit"
          className="flex w-1/2 justify-center rounded bg-primary p-3 font-medium text-gray disabled:bg-slate-500"
          disabled={isLoading || isSubmitting}
        >
          {isLoading || isSubmitting ? "Loading..." : buttonName}
        </button> */}

          {/* {showRejectButton && (
          <button
            onClick={handleReject}
            type="button"
            className="flex w-1/2 justify-center rounded bg-danger p-3 font-medium text-gray disabled:bg-slate-500"
            disabled={loading}
          >
            {loading ? "Loading..." : "Reject"}
          </button>
        )} */}
        </div>
      </form>
    </div>
  );
};

export default UnderTestingForm;
