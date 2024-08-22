"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { createFrontDesk } from "../actions";
import SubmitButton from "@/components/submit-button/submit-button";
import Select from "@/components/select-input";
import { Data } from "./page";
import { getCurrentLocalISOString } from "@/lib/utils";
import UncontrolledComboBox from "@/components/combo-box/uncontrolled-combo-box";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import ComboBox2 from "@/components/combo-box/combo-box2";
import { FullParametersType } from "@/types/parametets";
import { Trash2 } from "lucide-react";



type InitialState = {
  fieldErrors?: {} | null;
  type?: string | null;
  message?: any | string | null;
};

type props = {
  data: Data;
};

const initalState: InitialState = {
  fieldErrors: {},
  type: null,
  message: null,
};
const QuotationAddForm = ({ data }: props) => {
  // const {customerId,setCustomerId} = useState<string|number>('');
  const [state, formAction] = useFormState(createFrontDesk, initalState);
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
      router.push("/dashboard/quotations");
    }
  }, [state, router]);

 

  return (
    <form action={formAction}>
      <div className="p-6.5">
        <div className="mb-4.5">
          {/* <Select label="Customer" name="customer_id">
            {data?.customers?.map((customer) => (
              <option value={customer.id} key={customer.id}>
                {customer.company_name}
              </option>
            ))}
          </Select> */}
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Customer
              </label>

              <UncontrolledComboBox
                name="customer_id"
                data={data.customers.map((t) => ({
                  name: t.company_name,
                  value: t.id,
                }))}
                value={""}
              />
            </div>
          </div>
        </div>

        {/* <div className="mb-4.5"> */}
        {/* <label className="mb-2.5 block text-black dark:text-white">
            Customer
          </label> */}
        {/* <input
            type="text"
            name="company_name"
            placeholder=" Customer"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          /> */}
        {/* </div> */}

        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Mode of Received
          </label>
          <input
            type="text"
            name="courier_name"
            placeholder=" Mode of Received"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            required
          />
        </div>
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            No. of boxes Received
          </label>
          <input
            type="text"
            name="no_of_boxes_received"
            placeholder=" Mode of Received"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            required
          />
        </div>

        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Date Received
          </label>
          <input
            type="datetime-local"
            name="date_of_received"
            placeholder="Date Received"
            defaultValue={getCurrentLocalISOString().slice(0, 16)}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Storage Condition
          </label>
          <input
            type="text"
            name="temperature"
            placeholder="Storage Condition"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>
        {/* <div className="mb-4.5">
          <Select label="Parcel Recived" name="parcel_received">
           <option value="SAMPLE">Sample</option>
           <option value="Material">Material</option>
          </Select>
        </div> */}
        <div className="mb-4.5">
          <Select label="Received Condition" name="received_condition">
            <option value="GOOD">Good</option>
            <option value="DAMAGED">Damaged</option>
          </Select>
        </div>

        <SubmitButton />
      </div>
    </form>
  );
};

export default QuotationAddForm;


const TestParamsForm = ({
  control,
  register,
  data,
  filterId,
  arrayFieldName,
  productId,
}: {
  control: any;
  register: any;
  data: FullParametersType[];
  filterId: [] | number[] | string;
  arrayFieldName: string;
  productId?: string | number;
}) => {
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: arrayFieldName,
  });

  const test_watch = useWatch({
    control: control,
    name: arrayFieldName,
  });

  const [testTypesName, setTestTypesName] = useState<string[]>([]);
  const [methods, setMethods] = useState<string[]>([]);
  const [parameters, setParameters] = useState<FullParametersType[]>([]);

  // useEffect(() => {
  //   if (data.length) {
  //     if (filterId.toString() === "1"){

  //     }
  //   }
  // }, [data, append, replace]);

  useEffect(() => {
    async function fetchTestParameters(query: string, filterIdLength: number) {
      // let res = await fetch(
      //   `${SERVER_API_URL}/parameters/product/${product}?${query}`,
      // );
      console.log("here");
      let res = await fetch(`/api/registrations/parameters/?${query}`);
      const response: any = await res.json();
      if (filterIdLength === 2) {
        const micro_params =
          data?.filter((test: any) => test.test_type_id.toString() === "1") ??
          [];
        setParameters([...micro_params, ...response]);
        return;
      }
      setParameters(response);
    }

    if (!filterId) {
      return;
    }

    if (productId) {
      const query = `product=${encodeURIComponent(productId.toString())}&test_type=${encodeURIComponent("2")}`;

      if (filterId.length === 2) {
        fetchTestParameters(query, filterId.length);
        return;
      }
      if (filterId.length === 1) {
        if (filterId[0] === 2) {
          fetchTestParameters(query, filterId.length);
        }
        if (filterId[0] === 1) {
          const micro_params =
            data?.filter((test: any) => test.test_type_id.toString() === "1") ??
            [];
          if (micro_params.length) setParameters(micro_params);
        }
      }
    }
  }, [data, filterId, productId]);
  // useEffect(() => {
  //   if (data.length) {
  //     replace([]);
  //     data.forEach((para, idx) =>
  //       append({
  //         test_params_id: para.id,
  //         order: idx + 1,
  //       }),
  //     );
  //   }
  // }, [data, append, replace]);

  useEffect(() => {
    const ids =
      test_watch?.map((field: any) => {
        if (field.test_parameter_id !== "")
          return field.test_parameter_id.toString();
      }) ?? [];
    console.log(ids);
    const tests = data.filter((para) => ids.includes(para.id.toString()));

    console.log(tests);

    const test_names: string[] = [];

    ids.forEach((id: string) => {
      const test_name =
        tests?.find((t) => t.id.toString() === id)?.test_type?.name ??
        undefined;
      if (test_name) test_names.push(test_name);
    });

    const methods: string[] = [];
    ids.forEach((id: any) => {
      const method =
        tests?.find((t) => t.id.toString() === id)?.method_or_spec ?? undefined;
      if (method) methods.push(method);
    });
    console.log(test_names);

    setTestTypesName(test_names);
    setMethods(methods);
  }, [data, test_watch]);

  const addAllTestParameters = () => {
    if (parameters.length) {
      replace([]);
      parameters.forEach((para, idx) =>
        append({
          test_parameter_id: para.id,
          order: idx + 1,
        }),
      );
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-2 pb-2.5 pt-2 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-3.5 xl:pb-1">
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
              <th className="min-w-[320px] px-2 py-4 font-medium text-black dark:text-white xl:pl-4">
                Test Parameter Name
              </th>
              {/* <th className="w-[100px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                QTY
              </th> */}
              <th className="w-[100px] px-2 py-4 font-medium text-black dark:text-white xl:pl-4">
                Test Type
              </th>
              <th className="w-[220px] px-2 py-4 font-medium text-black dark:text-white xl:pl-6">
                Method / Spec
              </th>
              <th className="w-[100px] px-2 py-4 font-medium text-black dark:text-white xl:pl-6">
                Priority Order
              </th>
              <th className="w-[100px] px-2 py-4 font-medium text-black dark:text-white xl:pl-6">
                Remove?
              </th>
            </tr>
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
                  {/* <h5 className="font-medium text-black dark:text-white">
                  {
                    data.trf?.test_details?.[idx]?.parameter
                      ?.testing_parameters
                  }
                </h5>
                <input
                  type="hidden"
                  {...form.register(
                    `testing_details.${idx}.parameter_id`
                  )}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                /> */}

                  {/* <Select
                    name={`${arrayFieldName}.${idx}.test_params_id`}
                    register={register}
                  >
                    <option value="">------------</option>
                    {data?.map((parameter) => (
                      <option value={parameter.id} key={parameter.id}>
                        {parameter.testing_parameters}
                      </option>
                    ))}
                  </Select> */}
                  <Controller
                    name={`${arrayFieldName}.${idx}.test_parameter_id`}
                    control={control}
                    render={({ field: { onChange, value, onBlur } }) => (
                      <ComboBox2
                        name={`${arrayFieldName}.${idx}.test_parameter_id`}
                        data={parameters.map((t) => ({
                          name: `${t.testing_parameters} - (${t.method_or_spec})`,
                          value: t.id,
                        }))}
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                      />
                    )}
                  />
                </td>
                {/* <td className="border-b border-[#eee] px-1 py-3 pl-9 dark:border-strokedark xl:pl-11">
                  <input
                    type="text"
                    {...register(`${arrayFieldName}.${idx}.quantity`)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 pl-1 pr-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </td> */}
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-4">
                  <h5 className="font-medium text-black dark:text-white">
                    {testTypesName[idx]}
                  </h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-6">
                  <h5 className="font-medium text-black dark:text-white">
                    {methods[idx]}
                  </h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-6">
                  <input
                    type="text"
                    {...register(`${arrayFieldName}.${idx}.order`)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-2 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
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
            onClick={() =>
              append({
                test_parameter_id: "",
                order: fields.length + 1,
              })
            }
          >
            Add Test
          </button>
          <button
            type="button"
            className="mt-2 flex w-1/5 transform-gpu items-center justify-center rounded border-2 border-primary p-3 font-medium text-black transition-all duration-300 hover:bg-primary hover:text-white active:scale-95 disabled:bg-slate-500"
            onClick={addAllTestParameters}
          >
            Add All
          </button>
        </div>
      </div>
    </div>
  );
};