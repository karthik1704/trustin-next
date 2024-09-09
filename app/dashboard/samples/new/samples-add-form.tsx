"use client";
import { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch, Form } from "react-hook-form";
import { Trash2 } from "lucide-react";
import Select from "@/components/select-input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createSamples } from "../actions";
import { SERVER_API_URL } from "@/app/constant";

type Sample = {
  name: string;
  batch_id: number | string;
  test_type_id: string;
  test_params: Array<{
    test_parameter_id: string;
    order: number | string;
  }>;
};

type FormDatas = {
  samples: Sample[];
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

const SamplesAddForm = ({ data }: { data: any }) => {
  const {
    control,
    register,
    formState: { isLoading, isSubmitting },
    handleSubmit,
  } = useForm<Sample>({
    defaultValues: {
      name: "",
      batch_id: "",
      test_type_id: "1",
      test_params: [
        {
          test_parameter_id: "",
          order: "",
        },
      ],
    },
  });

  const sampleWatch = useWatch({
    control,
    name: "test_type_id",
  });
  const batchWatch = useWatch({
    control,
    name: "batch_id",
  });


  const [filterId, setFilterId] = useState("1");
  const [parameters, setParameters] = useState<[]>([]);
  const [selectedBatch, setSelectBatch] = useState<{} | null>(null);

  useEffect(() => {
    // TODO: need some imporvement in future
    // const ids = sampleWatch.map((field, idx) => field.test_type_id);
    setFilterId(sampleWatch);
  }, [sampleWatch]);

  useEffect(() => {
    async function fetchTestParameters(query: string, product: string) {
      let res = await fetch(
        `${SERVER_API_URL}/parameters/product/${product}?${query}`,
      );
      const response: any = await res.json();
      setParameters(response);
    }

    if (filterId && batchWatch) {
      const query = `test_type=${encodeURIComponent(filterId)}`;
      const batch = data.batches.find(
        (batch: any) => batch.id.toString() === batchWatch.toString(),
      );
      setSelectBatch(batch);
      if (filterId === "2") {
        if (batch) {
          fetchTestParameters(query, batch.product_id.toString());
        }
      }
      if (filterId === "1") {
        const micro_params = data.test_params.filter(
          (test: any) => test.test_type_id.toString() === "1",
        );
        if (micro_params.length) setParameters(micro_params);
      }
    }
  }, [batchWatch, data.batches, data.test_params, filterId]);

  const [state, setState] = useState<InitialState | undefined>(initialState);
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

  const handleForm = async (data: Sample) => {
    const res = await createSamples(data);
    setState(res);
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(handleForm)}>
      <div className="p-6.5">
        <div>
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-col">
            <div className="w-full xl:w-full ">
              <label className="mb-2.5 block w-full table-auto text-black dark:text-white">
                Batch
              </label>

              <div className="relative z-20 bg-transparent dark:bg-form-input">
                <select
                  {...register(`batch_id`)}
                  className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                >
                  <option value={0}>------------</option>
                  {data?.batches?.map((t: any) => (
                    <option value={t.id} key={t.id}>
                      {t.batch_no}
                    </option>
                  ))}
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
            </div>

            <div className="w-full xl:w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Sample Name
              </label>
              <input
                type="text"
                {...register(`name`)}
                placeholder="Enter Sample Name"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
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

            <div className="w-full xl:w-full">
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
            </div>
            <div className="w-full xl:w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Product Name
              </label>
              <h5>{selectedBatch?.product?.product_name}</h5>
            </div>
            <div className="w-full xl:w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Company Name
              </label>
              <h5>{selectedBatch?.customer?.company_name}</h5>
            </div>
          </div>
          {/* // Test Params */}
          <TestParamsForm
            filterId={filterId}
            data={parameters}
            {...{ control, register }}
          />
        </div>

        <button
          type="submit"
          className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Loading" : "Submit"}
        </button>
      </div>
    </form>
  );
};

const TestParamsForm = ({
  control,
  register,
  data,
  filterId,
}: {
  control: any;
  register: any;
  data: any;
  filterId: [] | number | string;
}) => {
  const { fields, append, remove } = useFieldArray({
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
    const ids = test_watch.map((field, idx) => {
      if (field.test_parameter_id !== "")
        return field.test_parameter_id.toString();
    });
    console.log(ids);
    const tests = data.filter((para) => ids.includes(para.id.toString()));

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
  }, [data, test_watch]);

  return (
    <div className="mb-4">
      {fields.map((item, index) => (
        <div key={item.id} className="mb-4 mt-2">
          <div className="mb-2 flex  justify-between border-b-2">
            <p>
              Test Parameter <strong>#{index + 1}:</strong>
            </p>
            <div>
              <button
                type="button"
                className="flex  justify-center rounded-full p-2   font-medium text-black hover:bg-gray "
                onClick={() => remove(index)}
              >
                <Trash2 className="w-4" />
              </button>
            </div>
          </div>
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <Select
              name={`test_params.${index}.test_parameter_id`}
              register={register}
              label={"Test Parameter Name"}
              width="w-full xl:w-1/5 "
            >
              <option value="">------------</option>
              {data
                ?.filter((t: any) => t.test_type_id.toString() === filterId)
                .map((t: any) => (
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
                {methods[index] ?? ""}
              </h5>
            </div>
            <div className="w-full xl:w-1/5">
              <label className="mb-2.5 block text-black dark:text-white">
                Test Type
              </label>
              <h5 className="font-medium text-black dark:text-white">
                {testTypesName[index] ?? ""}
              </h5>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="mb-4 mt-2 flex justify-center rounded bg-primary p-3 font-medium text-gray"
        onClick={() => append({ test_parameter_id: "", order: 0 })}
      >
        Add Test parameter
      </button>
    </div>
  );
};

export default SamplesAddForm;
