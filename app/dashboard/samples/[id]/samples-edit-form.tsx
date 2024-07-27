"use client";
import { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch, Form } from "react-hook-form";
import { Trash2 } from "lucide-react";
import Select from "@/components/select-input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createSamples } from "../actions";
import { SERVER_API_URL } from "@/app/constant";
import SubmitButton from "@/components/submit-button/submit-button";

type Sample = {
  sample_name: string;
  batch_or_lot_no: string;
  manufactured_date: string;
  expiry_date: string;
  batch_size: 0;
  received_quantity: 0;
  description: string;
  sample_condition: string;
  sterilization_batch_no: string;
  tat: string;
  // test_type_id: string;

  test_params: Array<{
    test_parameter_id: string;
    order: number | string;
  }>;
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

const SamplesEditForm = ({
  data,
  actionFn,
}: {
  data: any;
  actionFn: (
    data: any,
  ) => Promise<
    { fieldErrors: null; type: string; message: string | undefined } | undefined
  >;
}) => {
  const {
    control,
    register,
    formState: { isLoading, isSubmitting },
    handleSubmit,
  } = useForm<Sample>({
    defaultValues: {
      sample_name: data.sample.sample_name,
      batch_or_lot_no: data.sample.batch_or_lot_no,
      manufactured_date: data.sample.manufactured_date ?? "",
      expiry_date: data.sample.expiry_date ?? "",
      batch_size: data.sample.batch_size,
      received_quantity: data.sample.received_quantity,
      description: data.sample?.description ?? "",
      sample_condition: data.sample?.sample_condition ?? "",
      sterilization_batch_no: data.sample?.sterilization_batch_no ?? "",
      tat: data.sample.tat
        ? new Date(data.sample.tat).toISOString().split("T")[0]
        : "",
      // test_type_id: data.sample.test_type_id.toString(),
    },
  });

  // const sampleWatch = useWatch({
  //   control,
  //   name: "test_type_id",
  // });
  // const batchWatch = useWatch({
  //   control,
  //   name: "batch_id",
  // });

  const [filterId, setFilterId] = useState(
    data?.sample?.test_type_id.toString(),
  );
  const [parameters, setParameters] = useState<[]>([]);
  // const [selectedBatch, setSelectBatch] = useState<{} | null>(null);

  // useEffect(() => {
  //   // TODO: need some imporvement in future
  //   // const ids = sampleWatch.map((field, idx) => field.test_type_id);
  //   setFilterId(sampleWatch);
  // }, [sampleWatch]);

  useEffect(() => {
    async function fetchTestParameters(query: string, product: string) {
      let res = await fetch(
        `${SERVER_API_URL}/parameters/product/${product}?${query}`,
      );
      const response: any = await res.json();
      setParameters(response);
    }

    if (filterId) {
      const query = `product=${encodeURIComponent(data?.sample?.registration?.product_id.toString(),
    )}&test_type=${encodeURIComponent("2")}`;

      if (filterId === "2") {
        fetchTestParameters(
          query,
          data?.sample?.registration?.product_id.toString(),
        ); 
      }
      if (filterId === "1") {
        const micro_params = data.test_params.filter(
          (test: any) => test.test_type_id.toString() === "1",
        );
        if (micro_params.length) setParameters(micro_params);
      }
    }
  }, [data.test_params, data, filterId]);

  const [state, setState] = useState<InitialState | undefined>(initialState);
  const [showForm, setShowForm] = useState<boolean>(false);
  const router = useRouter();

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
      router.push("/dashboard/samples");
    }
  }, [state, router]);

  const toggleShowForm = () => {
    setShowForm((prev) => !prev);
  };

  const handleForm = async (data: Sample) => {
    const res = await actionFn(data);
    setState(res);
    console.log(data);
  };

  return (
    <div>
      <div className="flex justify-end">
        <button
          type="button"
          className="flex w-1/5 justify-center rounded bg-primary p-3 font-medium text-gray"
          onClick={toggleShowForm}
        >
          {showForm ? "Close" : "Edit"}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit(handleForm)}>
          <div className="p-6.5">
            <div>
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-col">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Sample Name
                    </label>
                    <input
                      type="text"
                      {...register(`sample_name`)}
                      placeholder="Enter Sample Name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div className="">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Batch No
                    </label>
                    <input
                      type="text"
                      {...register(`batch_or_lot_no`)}
                      placeholder="Enter Batch No"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div className="">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Manufactured Date
                    </label>
                    <input
                      type="text"
                      {...register(`manufactured_date`)}
                      placeholder="Enter Manufactured Date"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div className="">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      {...register(`expiry_date`)}
                      placeholder="Enter Expiry Date"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div className="">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Batch Size
                    </label>
                    <input
                      type="text"
                      {...register(`batch_size`)}
                      placeholder="Enter Batch Size"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div className="">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Received Quantity
                    </label>
                    <input
                      type="text"
                      {...register(`received_quantity`)}
                      placeholder="Enter Received Quantity"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div className="">
                    <label className="mb-2.5 block text-black dark:text-white">
                      TAT
                    </label>
                    <input
                      {...register(`tat`)}
                      type="date"
                      placeholder="Enter Turn Around Time"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div className="">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Sample Condition{" "}
                    </label>
                    <input
                      {...register(`sample_condition`)}
                      type="text"
                      required
                      placeholder="Enter sample condition"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div className="">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Sterilization Batch No.
                    </label>
                    <input
                      {...register(`sterilization_batch_no`)}
                      type="text"
                      required
                      placeholder="Enter sterilization batch no."
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
                <div className="mb-4.5">
                  <div className="w-full">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Sample Description
                    </label>
                    <textarea
                      {...register(`description`)}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>

                {/* <div className="w-full xl:w-1/4">
                <label className="mb-2.5 block text-black dark:text-white">
                  Department
                </label>
                <input
                  type="text"
                  {...register(`samples.${index}.department`)}
                  placeholder="Enter Test Type"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>*/}

                {/* <div className="w-full xl:w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Test Type
              </label>

              <div className="relative z-20 bg-transparent dark:bg-form-input">
                <select
                  {...register(`test_type_id`)}
                  className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                >
                  <option value={"1"}>Micro</option>
                  <option value={"2"}>Mech</option>
                </select>
                <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
                  <svg
                    className="fill-current"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g opacity="0.8">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                        fill=""
                      ></path>
                    </g>
                  </svg>
                </span>
              </div>
            </div> */}
              </div>
              {/* // Test Params */}
              <TestParamsForm
                filterId={"1"}
                parameters={parameters}
                data={data}
                {...{ control, register }}
              />
            </div>

            <button
              type="submit"
              className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray disabled:bg-slate-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Loading" : "Submit"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const TestParamsForm = ({
  control,
  register,
  data,
  filterId,
  parameters,
}: {
  control: any;
  register: any;
  data: any;
  parameters: any;
  filterId: [] | number | string;
}) => {
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: `test_params`,
  });

  const test_watch = useWatch({
    control: control,
    name: "test_params",
  });

  const [testTypesName, setTestTypesName] = useState<string[]>([]);
  const [methods, setMethods] = useState<string[]>([]);

  useEffect(() => {
    if (parameters && parameters?.length) {
      replace([]);
      data?.sample?.sample_test_parameters.forEach((test) => {
        append({
          test_params_id: test.test_parameter_id.toString(),
          order: test.order,
        });
      });
    }
  }, [
    append,
    data?.sample?.sample_test_parameters,
    parameters,
    parameters?.length,
    replace,
  ]);

  useEffect(() => {
    if (!test_watch) return;
    const ids = test_watch.map((field, idx) => {
      if (field.test_params_id !== "") return field.test_params_id.toString();
    });
    console.log(ids);
    const tests = parameters.filter((para) => ids.includes(para.id.toString()));

    console.log(tests);

    const test_names: string[] = [];

    ids.forEach((id) => {
      const test_name =
        tests?.find((t) => t.id.toString() === id)?.test_type?.name ??
        undefined;
      if (test_name) test_names.push(test_name);
    });

    const methods: string[] = [];
    ids.forEach((id) => {
      const method =
        tests?.find((t) => t.id.toString() === id)?.method_or_spec ?? undefined;
      if (method) methods.push(method);
    });
    console.log(test_names);

    setTestTypesName(test_names);
    setMethods(methods);
  }, [parameters, test_watch]);

  return (
    <div className="mb-4">
      {fields.map((item, index) => (
        <div key={item.id} className="mb-4 mt-2">
          <div className="mb-2 flex justify-between border-b-2">
            <p>
              Test Parameter <strong>#{index + 1}:</strong>
            </p>
            <div>
              <button
                type="button"
                className="flex justify-center rounded-full p-2 font-medium text-black hover:bg-gray"
                onClick={() => remove(index)}
              >
                <Trash2 className="w-4" />
              </button>
            </div>
          </div>
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <Select
              name={`test_params.${index}.test_params_id`}
              register={register}
              label={"Test Parameter Name"}
              width="w-full xl:w-1/2 "
            >
              <option value="">------------</option>
              {parameters.map((t: any) => (
                <option value={t.id} key={t.id}>
                  {t.testing_parameters}
                </option>
              ))}
            </Select>
            <div className="w-full xl:w-1/5">
              <label className="mb-2.5 block text-black dark:text-white">
                order
              </label>
              <input
                type="number"
                {...register(`test_params.${index}.order`)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
            <div className="w-full xl:w-1/5">
              <label className="mb-2.5 block text-black dark:text-white">
                Method
              </label>
              <h5 className="font-medium text-black dark:text-white">
                {methods[index]}
              </h5>
            </div>
            <div className="w-full xl:w-1/6">
              <label className="mb-2.5 block text-black dark:text-white">
                Test Type
              </label>
              <h5 className="font-medium text-black dark:text-white">
                {testTypesName[index]}
              </h5>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="mb-4 mt-2 flex justify-center rounded bg-primary p-3 font-medium text-gray"
        onClick={() =>
          append({ test_parameter_id: "", order: fields.length + 1 })
        }
      >
        Add Test parameter
      </button>
    </div>
  );
};

export default SamplesEditForm;
