"use client";
import { useEffect, useState } from "react";
import { createParameters } from "../actions";
import Select from "@/components/select-input";
import { Data } from "./page";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import SubmitButton from "@/components/submit-button/submit-button";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { ArrowRightLeft } from "lucide-react";
import ComboBox2 from "@/components/combo-box/combo-box2";

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

type Props = {
  data: Data;
};
const ParameterNewForm = ({ data }: Props) => {
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { isLoading, isSubmitting },
  } = useForm();
  const { fields, append, remove } = useFieldArray({
    name: "methods",
    control,
  });
  const [showProductSelect, setShowProductSelect] = useState<boolean>(true);

  const watchTestType = useWatch({
    control,
    name: "test_type_id",
    defaultValue: "1",
  });

  useEffect(() => {
    if (watchTestType) {
      if (watchTestType === "2") {
        setShowProductSelect(true);
      } else {
        setShowProductSelect(false);
        setValue("product_id", "null");
      }
    }
  }, [setShowProductSelect, setValue, watchTestType]);

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
      router.push("/dashboard/parameters");
    }
  }, [state, router]);

  const handleForm = async (data: any) => {
    // console.log(data);
    const res = await createParameters(data);
    setState(res);
  };

  return (
    // <Form control={control} onSubmit={handleSubmit}>
    <form onSubmit={handleSubmit(handleForm)}>
      <div className="p-6.5">
        <Select name="test_type_id" label="Test Type" register={register}>
          {data?.test_types.map((test) => (
            <option value={test.id} key={test.id}>
              {test.name}
            </option>
          ))}
        </Select>

        {/* <Select
          name="product_id"
          label="Product"
          register={register}
          disabled={!showProductSelect}
        >
          <option value="null">---Select Product---</option>
          {data?.products.map((product) => (
            <option value={product.id} key={product.id}>
              {product.product_name}
            </option>
          ))}
        </Select> */}
        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <div className="w-full">
            <label className="mb-2.5 block text-black dark:text-white">
              Product
            </label>
            <Controller
              name={`product_id`}
              control={control}
              render={({ field: { onChange, value, onBlur } }) => (
                <ComboBox2
                  name={`product_id`}
                  data={data.products.map((t) => ({
                    name: `${t.product_name}`,
                    value: t.id,
                  }))}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  disabled={!showProductSelect}
                />
              )}
            />
          </div>
        </div>

        <div className="mb-4">
          {fields.map((item, index) => (
            <div key={item.id} className="mb-4 mt-2">
              <div className="mb-2 flex justify-between border-b-2">
                <p>
                  Method <strong>#{index + 1}:</strong>
                </p>
                <div>
                  <button
                    type="button"
                    className="flex justify-center rounded-full p-2 font-medium text-black hover:bg-gray"
                    onClick={() => {
                      remove(index);
                      // form.setValue("no_of_samples", fields.length - 1);
                    }}
                  >
                    <Trash2 className="w-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 xl:flex-row xl:flex-wrap">
                <div className="mb-4.5 w-full">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Method or Specification
                  </label>
                  <input
                    type="text"
                    {...register(`methods.${index}.method_or_spec`)}
                    placeholder="Method or Specification"
                    required
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
              </div>
              <TestParamsForm
                control={control}
                register={register}
                arrayFieldName={`methods.${index}.parameters`}
                showLimits={!showProductSelect}
              />

              <hr />
              <hr className="mt-4" />
            </div>
          ))}
          <button
            type="button"
            className="relative flex w-1/5 transform-gpu items-center justify-center rounded border-2 border-primary p-3 font-medium text-black transition-all duration-300 hover:bg-primary hover:text-white active:scale-95 disabled:animate-none disabled:border-slate-500 disabled:transition-none disabled:hover:bg-none"
            onClick={() => append({ method_or_spec: "", parameters: [] })}
          >
            Add Method
          </button>
        </div>

        <button
          type="submit"
          className="mt-4 flex w-full transform-gpu justify-center rounded bg-primary p-3 font-medium text-gray transition-all duration-300 hover:bg-blue-500 active:scale-95 disabled:bg-slate-500"
          disabled={isLoading || isSubmitting}
        >
          {isSubmitting || isLoading ? "Loading..." : "Submit"}
        </button>
      </div>
      {/* </Form> */}
    </form>
  );
};

const TestParamsForm = ({
  control,
  register,
  arrayFieldName,
  showLimits,
}: {
  control: any;
  register: any;
  arrayFieldName: string;
  showLimits: boolean;
}) => {
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: arrayFieldName,
  });
  const [showSpec, setShowSpec] = useState<boolean[]>(fields.map(() => showLimits ?  true : false));

  useEffect(()=>{
    replace([])
    setShowSpec([])
  },[replace, showLimits])

  const handleShowSpec = (idx: number): void => {
    setShowSpec((prevState) =>
      prevState.map((value, i) => (i === idx ? !value : value)),
    );
  };

  const handleAppend = () => {
    append({
      testing_parameters: "",
      min_limits: "",
      max_limits: "",
    });
    setShowSpec((prevState) => [...prevState, showLimits ?  true : false]); // Add new entry to showSpec array
  };

  return (
    <div className="rounded-sm bg-white px-2 pb-2.5 sm:px-3.5 xl:pb-1">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => replace([])}
          className="hover:text-bule-400 mb-1 flex transform-gpu font-medium text-primary transition-all duration-300 hover:text-blue-400 active:scale-95 disabled:bg-slate-500"
        >
          Reset
        </button>
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="w-[20px] px-1 py-4 font-medium text-black dark:text-white xl:pl-4">
                S.NO.
              </th>
              <th className="max-w-[320px] px-2 py-4 font-medium text-black dark:text-white xl:pl-4">
                Test Parameters
              </th>
              {/* <th className="w-[100px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                QTY
              </th> */}
              <th className="min-w-[100px] px-2 py-4 font-medium text-black dark:text-white xl:pl-4">
                Specification Limits
              </th>

              <th className="w-[100px] px-2 py-4 font-medium text-black dark:text-white xl:pl-6">
                Switch
              </th>
              <th className="w-[100px] px-2 py-4 font-medium text-black dark:text-white xl:pl-6">
                Remove?
              </th>
            </tr>
            {/* {!showSpec && (
              <tr>
                <th></th>
                <th></th>
                <th className="min-w-[100px] px-2 py-4 font-medium text-black dark:text-white xl:pl-4">
                  Min
                </th>
                <th className="min-w-[100px] px-2 py-4 font-medium text-black dark:text-white xl:pl-4">
                  Max
                </th>
                <th></th>
                <th></th>
              </tr>
            )} */}
          </thead>
          <tbody>
            {fields.map((item, idx) => (
              <tr key={item.id}>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-4">
                  <h5 className="font-medium text-black dark:text-white">
                    {idx + 1}
                  </h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-4">
                  {" "}
                  <input
                    type="text"
                    {...register(`${arrayFieldName}.${idx}.testing_parameters`)}
                    required
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-2 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </td>

                {showSpec[idx] ? (
                  <>
                    <td className="flex border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-4">
                      <input
                        type="text"
                        {...register(
                          `${arrayFieldName}.${idx}.specification_limits`,
                        )}
                        placeholder="Sepcification Limits"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-2 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td className="flex border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-4">
                      <input
                        type="text"
                        {...register(`${arrayFieldName}.${idx}.min_limits`)}
                        placeholder="Min Limits"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-2 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />

                      <input
                        type="text"
                        {...register(`${arrayFieldName}.${idx}.max_limits`)}
                        placeholder="Max Limits"
                        className="ml-4 w-full rounded border-[1.5px] border-stroke bg-transparent px-2 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </td>
                  </>
                )}

                <td className="border-b border-[#eee] px-2 py-5 pl-6 dark:border-strokedark xl:pl-6">
                  <button
                    type="button"
                    onClick={() => handleShowSpec(idx)}
                    className="hover:bg-gray-300 focus:ring-gray-400 active:bg-gray-400 disabled:text-slate-200 transform rounded-full bg-transparent p-2 transition-transform duration-300 ease-in-out focus:outline-none focus:ring-2"
                    disabled={showLimits}
                  >
                    <ArrowRightLeft  />
                  </button>
                </td>
                <td className="border-b border-[#eee] px-2 py-5 pl-6 dark:border-strokedark xl:pl-6">
                  <button type="button" onClick={() => remove(idx)}>
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex gap-4">
          <button
            type="button"
            className="mt-2 flex w-1/5 transform-gpu items-center justify-center rounded border-2 border-primary p-3 font-medium text-black transition-all duration-300 hover:bg-primary hover:text-white active:scale-95 disabled:bg-slate-500"
            onClick={handleAppend}
          >
            Add Parameter
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParameterNewForm;
