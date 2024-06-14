"use client";
import { SERVER_API_URL } from "@/app/constant";
import { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch, Form } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2 } from "lucide-react";
import Combobox from "@/components/combo-box";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Form as UiForm,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  SampleRecord,
  TestParameter,
  UpdateData,
  UpdateDataType,
} from "../typings";
import { FullParametersType } from "@/types/parametets";
import Select from "@/components/select-input";

const TESTTYPE = {
  1: "MICRO",
  2: "MECH",
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

const RegistrationEditForm = ({
  data,
  updateFn,
}: {
  data: UpdateDataType;
  updateFn: (
    data: any,
  ) => Promise<
    { fieldErrors: null; type: string; message: string | undefined } | undefined
  >;
}) => {
  const form = useForm<UpdateData>({
    defaultValues: {
      trf_code: data?.registration?.trf_code,
      branch_id: data?.registration?.branch_id,
      product_id: data?.registration?.product_id,
      company_id: data?.registration?.company_id,
      company_name: data?.registration?.company_name,
      customer_address_line1: data?.registration?.customer_address_line1,
      customer_address_line2: data?.registration?.customer_address_line2,
      city: data?.registration?.city,
      state: data?.registration?.state,
      pincode_no: data?.registration?.pincode_no,
      gst: data?.registration?.gst,
      date_of_received: new Date(data?.registration?.date_of_received)
        .toISOString()
        .split("T")[0],
      test_type_id: data?.registration?.test_type_id,
      nabl_logo: data?.registration?.nabl_logo ? "1" : "0",
      license_no: data?.registration?.license_no,
      testing_process: data?.registration?.testing_process,
      sampled_by: data?.registration?.sampled_by,
      sample_disposal_process: data?.registration?.sample_disposal_process,
      reports_send_by: data?.registration?.reports_send_by,

      sample_name: data?.registration?.sample_name,
      batch_or_lot_no: data?.registration?.batch_or_lot_no,
      manufactured_date: new Date(data?.registration?.manufactured_date)
        .toISOString()
        .split("T")[0],
      expiry_date: new Date(data?.registration?.expiry_date)
        .toISOString()
        .split("T")[0],
      batch_size: data?.registration?.batch_size,
      received_quantity: data?.registration?.received_quantity,
      no_of_samples: data?.registration?.no_of_samples,
      controlled_quantity: data?.registration?.controlled_quantity,
      samples:
        data?.registration?.samples?.map((sample) => ({
          id: sample.id,
          sample_name: sample.sample_name,
          batch_or_lot_no: sample.batch_or_lot_no,
          manufactured_date: new Date(sample.manufactured_date)
            .toISOString()
            .split("T")[0],
          expiry_date: new Date(sample.expiry_date).toISOString().split("T")[0],
          batch_size: sample.batch_size,
          received_quantity: sample.received_quantity,
        })) ?? [],
      test_params: data?.registration?.test_params.map((test) => ({
        test_params_id: test.test_params_id,
        order: test.order,
      })),
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "samples", // Name of the array in your schema
  });

  const watchCompanyFieldValue = useWatch({
    control: form.control,
    name: "company_id",
  });

  const watchTestTypeId = useWatch({
    control: form.control,
    name: "test_type_id",
  });
  const watchProductId = useWatch({
    control: form.control,
    name: "product_id",
  });

  const watchNoOfSamplesValue = useWatch({
    control: form.control,
    name: "no_of_samples",
  });

  const [filterId, setFilterId] = useState(
    data?.registration?.test_type_id.toString(),
  );
  const [parameters, setParameters] = useState<FullParametersType[]>(
    data?.parameters ?? [],
  );

  const [state, setState] = useState<InitialState | undefined>(initialState);
  const router = useRouter();

  useEffect(() => {
    // TODO: need some imporvement in future
    // const ids = sampleWatch.map((field, idx) => field.test_type_id);
    if (watchTestTypeId) setFilterId(watchTestTypeId.toString());
  }, [watchTestTypeId]);

  useEffect(() => {
    async function fetchTestParameters(query: string, product: string) {
      let res = await fetch(
        `${SERVER_API_URL}/parameters/product/${product}?${query}`,
      );
      const response: any = await res.json();
      setParameters(response);
    }

    if (filterId && watchProductId) {
      const query = `test_type=${encodeURIComponent(filterId)}`;

      if (filterId === "2") {
        fetchTestParameters(query, watchProductId.toString());
      }
      if (filterId === "1") {
        const micro_params =
          data?.parameters?.filter(
            (test: any) => test.test_type_id.toString() === "1",
          ) ?? [];
        if (micro_params.length) setParameters(micro_params);
      }
    }
  }, [data?.parameters, filterId, watchProductId]);

  useEffect(() => {
    const {
      sample_name,
      batch_or_lot_no,
      manufactured_date,
      expiry_date,
      batch_size,
      received_quantity,
    } = form.getValues();

    if (watchNoOfSamplesValue !== data?.registration.no_of_samples) {
      if (watchNoOfSamplesValue === 0) {
        replace([]);
      } else if (watchNoOfSamplesValue > 0) {
        const extraSamples = Math.abs(
          data?.registration?.no_of_samples - watchNoOfSamplesValue,
        );
        console.log(extraSamples);

        let fieldsLength = fields.length;

        for (let i = 0; i < extraSamples; i++) {
          if (fieldsLength === watchNoOfSamplesValue) break;
          append({
            id: null,
            sample_name: `${sample_name} ${fieldsLength + i}`,
            batch_or_lot_no,
            manufactured_date,
            expiry_date,
            batch_size,
            received_quantity,
          });
        }
      }
    }
  }, [
    append,
    data?.registration.no_of_samples,
    form,
    replace,
    watchNoOfSamplesValue,
  ]);

  const createSamples = () => {
    const {
      sample_name,
      batch_or_lot_no,
      manufactured_date,
      expiry_date,
      batch_size,
      received_quantity,
    } = form.getValues();

    if (watchNoOfSamplesValue !== data?.registration.no_of_samples) {
      if (watchNoOfSamplesValue === 0) {
        replace([]);
      } else if (watchNoOfSamplesValue > 0) {
        const extraSamples = Math.abs(
          data?.registration?.no_of_samples - watchNoOfSamplesValue,
        );
        console.log(extraSamples);

        let fieldsLength = fields.length;

        for (let i = 0; i < extraSamples; i++) {
          if (fieldsLength === watchNoOfSamplesValue) break;
          append({
            id: null,
            sample_name: `${sample_name} ${fieldsLength + i}`,
            batch_or_lot_no,
            manufactured_date,
            expiry_date,
            batch_size,
            received_quantity,
          });
        }
      }
    }
  };

  useEffect(() => {
    // Make API call when the watched field value changes
    if (
      watchCompanyFieldValue.toString() ===
      data?.registration?.company_id.toString()
    )
      return;

    const getCompanyDetail = (company_id: any) => {
      const customer = data.customers.find(
        (customer) => customer.id.toString() === company_id,
      );
      form.setValue("company_name", customer?.company_name ?? "");
      form.setValue("city", customer?.city ?? "");
      form.setValue("state", customer?.state ?? "");
      form.setValue("pincode_no", customer?.pincode_no ?? "");
      form.setValue(
        "customer_address_line1",
        customer?.customer_address_line1 ?? "",
      );
      form.setValue(
        "customer_address_line2",
        customer?.customer_address_line2 ?? "",
      );
      form.setValue("gst", customer?.gst ?? "");
    };

    // Check if the field value is not empty before making the API call
    if (watchCompanyFieldValue) {
      const company_id = watchCompanyFieldValue;
      if (company_id) getCompanyDetail(company_id);
    }
  }, [
    watchCompanyFieldValue,
    form.setValue,
    form,
    data.customers,
    data?.registration?.company_id,
  ]);

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
      router.push("/dashboard/registrations");
    }
  }, [state, router]);

  const handleForm = async (data: UpdateData) => {
    console.log(data);
    const res = await updateFn(data);
    console.log(res);
    setState(res);
  };
  return (
    <UiForm {...form}>
      <form onSubmit={form.handleSubmit(handleForm)}>
        <div className="p-6.5">
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-9/12">
              <label className="mb-2.5 block text-black dark:text-white">
                TRF Code
              </label>
              <input
                type="text"
                {...form.register("trf_code")}
                placeholder="Enter TRF Code"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            <div className="w-full xl:w-9/12">
              <label className="mb-2.5 block text-black dark:text-white">
                Branch
              </label>

              <div className="relative z-20 bg-transparent dark:bg-form-input">
                <select
                  {...form.register("branch_id")}
                  className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                >
                  <option value="">------------</option>
                  {data.branches?.map((t: any) => (
                    <option value={t.id} key={t.id}>
                      {t.branch_name}
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
          </div>

          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-9/12">
              <label className="mb-2.5 block text-black dark:text-white">
                Company ID
              </label>

              <div className="relative z-20 bg-transparent dark:bg-form-input">
                {/* <Combobox
                  data={data?.customers.map((customer)=>({label: `${customer.customer_code} - ${customer.company_name}`, value: customer.id.toString()}))}
                  name="company_id"
                  form={form}
                  label="Company ID"
                  emptyMessage="NO Customer Found"
                /> */}
                <select
                  {...form.register("company_id")}
                  className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                >
                  <option value="">------------</option>
                  {data.customers.map((t) => (
                    <option value={t.id} key={t.id}>
                      {t.customer_code} - {t.company_name}
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
            <div className="w-full xl:w-9/12">
              <label className="mb-2.5 block text-black dark:text-white">
                Company Name
              </label>
              <input
                type="text"
                {...form.register("company_name")}
                placeholder="Enter Company Name"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
          </div>

          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black dark:text-white">
                Address Line 1
              </label>
              <input
                {...form.register("customer_address_line1")}
                placeholder="Enter Address Line 1"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black dark:text-white">
                Address Line 2
              </label>
              <input
                {...form.register("customer_address_line2")}
                placeholder="Enter Address Line 2"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
          </div>

          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black dark:text-white">
                City
              </label>
              <input
                {...form.register("city")}
                placeholder="Enter City"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black dark:text-white">
                State
              </label>
              <input
                {...form.register("state")}
                placeholder="Enter State"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
          </div>

          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black dark:text-white">
                Pincode
              </label>
              <input
                {...form.register("pincode_no")}
                placeholder="Enter Pincode"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black dark:text-white">
                Gst No
              </label>
              <input
                {...form.register("gst")}
                placeholder="Enter Gst No"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
          </div>

          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Date Of Received
              </label>
              <input
                type="date"
                {...form.register("date_of_received")}
                placeholder="Enter Date Of Recived"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
          </div>

          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Product
              </label>

              <div className="relative z-20 bg-transparent dark:bg-form-input">
                <select
                  {...form.register("product_id")}
                  className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                >
                  <option value="">------------</option>
                  {data.products.map((t: any) => (
                    <option value={t.id} key={t.id}>
                      {t.product_name}
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
          </div>

          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Test type
              </label>

              <div className="relative z-20 bg-transparent dark:bg-form-input">
                <select
                  {...form.register("test_type_id")}
                  className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                >
                  <option value="1">Micro</option>
                  <option value="2">Mech</option>
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
          </div>

          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black dark:text-white">
                License No
              </label>
              <input
                {...form.register("license_no")}
                placeholder="Enter Licese No"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
            <Select
              name="nabl_logo"
              label="NABL Logo"
              register={form.register}
              width={"w-full xl:w-1/2"}
            >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </Select>
          </div>
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <Select
              name="testing_process"
              label="Testing Process"
              register={form.register}
              width={"w-full xl:w-1/2"}
            >
              <option value="BATCH_ANALYSIS">BATCH ANALYSIS</option>
              <option value="METHOD_DEVELOPMENT">METHOD DEVELOPMENT</option>
              <option value="METHOD_VALIDATION">METHOD VALIDATION</option>
              <option value="RD_RESEARCH">R&D RESEARCH</option>
              <option value="REGULATORY">REGULATORY</option>
            </Select>
            <Select
              name="sampled_by"
              label="Sampled By"
              register={form.register}
              width={"w-full xl:w-1/2"}
            >
              <option value="CUSTOMER">CUSTOMER</option>
              <option value="LABORATORY">LABORATORY</option>
            </Select>
          </div>

          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <Select
              name="sample_disposal_process"
              label="Sample Disposal Process"
              register={form.register}
              width={"w-full xl:w-1/2"}
            >
              <option value="DISCARD">DISCARD</option>
              <option value="RETURN">RETURN</option>
            </Select>
            <Select
              name="reports_send_by"
              label="Report Send By"
              register={form.register}
              width={"w-full xl:w-1/2"}
            >
              <option value="COURIER">COURIER</option>
              <option value="EMAIL">EMAIL</option>
            </Select>
          </div>

          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black dark:text-white">
                Sample Name
              </label>
              <input
                {...form.register("sample_name")}
                placeholder="Enter Sample Name"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black dark:text-white">
                Batch / Lot No
              </label>
              <input
                {...form.register("batch_or_lot_no")}
                placeholder="Enter Batch / Lot No"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
          </div>
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black dark:text-white">
                Manufactured Date
              </label>
              <input
                {...form.register("manufactured_date")}
                type="date"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black dark:text-white">
                Expiry Date
              </label>
              <input
                {...form.register("expiry_date")}
                type="date"
                placeholder="Enter Expiry Date"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
          </div>

          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black dark:text-white">
                Batch Size
              </label>
              <input
                {...form.register("batch_size")}
                placeholder="Enter Batch Size"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black dark:text-white">
                Received Quantity
              </label>
              <input
                {...form.register("received_quantity")}
                placeholder="Enter Received Quantity"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
          </div>

          <div className="mb-4.5 flex flex-col gap-6 xl:flex-col">
            <div className="w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Controlled Quantity
              </label>
              <input
                required
                {...form.register("controlled_quantity")}
                placeholder="Enter Controlled quantity"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
            </div>
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-col">
            <div className="w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                No of Samples
              </label>
              <input
                required
                {...form.register("no_of_samples")}
                placeholder="Enter No of Samples"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
            <button
              type="button"
              className="relative flex w-1/5 transform-gpu items-center justify-center rounded border-2 border-primary p-3 font-medium text-black transition-all duration-300 hover:bg-primary hover:text-white active:scale-95 disabled:bg-slate-500"
              onClick={createSamples}
            >
              Add Samples
            </button>
          </div>

          <Tabs defaultValue="samples" className="w-full">
            <TabsList>
              <TabsTrigger value="samples">Samples</TabsTrigger>
              <TabsTrigger value="micro-parameters">
                Mech Parameters
              </TabsTrigger>
              <TabsTrigger value="mech-parameters">
                Micro Parameters
              </TabsTrigger>
            </TabsList>
            <TabsContent value="samples">
              <div className="mb-4">
                {fields.map((item, index) => (
                  <div key={item.id} className="mb-4 mt-2">
                    <div className="mb-2 flex justify-between border-b-2">
                      <p>
                        Sample <strong>#{index + 1}:</strong>
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
                      <div className="w-full xl:w-1/6">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Sample Name <span className="text-meta-1">*</span>
                        </label>
                        <input
                          {...form.register(`samples.${index}.sample_name`)}
                          placeholder="Enter Sample Name"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                        <input
                          type="hidden"
                          {...form.register(`samples.${index}.id`)}
                        />
                      </div>
                      <div className="w-full xl:w-1/6">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Batch / Lot No{" "}
                        </label>
                        <input
                          {...form.register(`samples.${index}.batch_or_lot_no`)}
                          placeholder="Enter Batch or Lot No"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                      </div>

                      <div className="w-full xl:w-1/6">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Mfg Date
                        </label>
                        <input
                          {...form.register(
                            `samples.${index}.manufactured_date`,
                          )}
                          type="date"
                          placeholder="Enter Expiry Date"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                      </div>

                      <div className="w-full xl:w-1/6">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Expiry Date
                        </label>
                        <input
                          {...form.register(`samples.${index}.expiry_date`)}
                          type="date"
                          placeholder="Enter Expiry Date"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                      </div>

                      <div className="w-full xl:w-1/6">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Batch Size{" "}
                        </label>
                        <input
                          {...form.register(`samples.${index}.batch_size`)}
                          type="number"
                          placeholder="Enter Batch Size"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                      </div>
                      <div className="w-full xl:w-1/6">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Received Quantity{" "}
                        </label>
                        <input
                          {...form.register(
                            `samples.${index}.received_quantity`,
                          )}
                          type="number"
                          placeholder="Enter Received Quantity"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                      </div>
                    </div>
                    <hr />
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="mech-parameters">
              <TestParamsForm
                control={form.control}
                register={form.register}
                data={data?.registration.test_params ?? []}
                filterId={filterId}
                arrayFieldName="mech-params"
                parameters={data.mechParameters ??[]}
                allData={data}
              />
            </TabsContent>
            <TabsContent value="micro-parameters">
              <TestParamsForm
                control={form.control}
                register={form.register}
                data={data?.registration.test_params??[]}
                filterId={filterId}
                arrayFieldName="micro-params"
                parameters={data.microParameters ??[]}
                allData={data}

              />
            </TabsContent>
          </Tabs>

          <button
            type="submit"
            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray disabled:bg-slate-500"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Loading..." : "Submit"}
          </button>
        </div>
      </form>
    </UiForm>
  );
};

const TestParamsForm = ({
  control,
  register,
  parameters,
  data,
  allData,
  filterId,
  arrayFieldName
}: {
  control: any;
  register: any;
  parameters: FullParametersType[];
  data: TestParameter[];
  allData: UpdateDataType;
  filterId: [] | number | string;
  arrayFieldName:string;
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
    if (allData.registration.test_type_id.toString() !== filterId) {
      if (parameters.length) {
        replace([]);
        parameters.forEach((para, idx) =>
          append({
            test_params_id: para.id,
            order: idx + 1,
          }),
        );
      }
      return;
    }
    if (parameters.length) {
      replace([]);
      data.forEach((para, idx) =>
        append({
          test_params_id: para.test_params_id,
          order: para.order,
        }),
      );
    }
  }, [
    data,
    append,
    replace,
    parameters,
    allData.registration.test_type_id,
    filterId,
  ]);
  useEffect(() => {
    const ids =
      test_watch?.map((field: any) => {
        if (field.test_params_id !== "") return field.test_params_id.toString();
      }) ?? [];
    console.log(ids);

    if (ids.length) {
      const tests = parameters.filter((para) =>
        ids.includes(para.id.toString()),
      );

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
          tests?.find((t) => t.id.toString() === id)?.method_or_spec ??
          undefined;
        if (method) methods.push(method);
      });
      console.log(test_names);

      setTestTypesName(test_names);
      setMethods(methods);
    }
  }, [data, test_watch, parameters]);
  const addAllTestParameters = ()=>{
    if (data.length) {
      replace([]);
      data.forEach((para, idx) =>
        append({
          test_params_id: para.id,
          order: idx + 1,
        }),
      );
    }
  }
 
    return (
      <div className="rounded-sm border border-stroke bg-white px-2 pb-2.5 pt-2 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-3.5 xl:pb-1">
        <div className="flex justify-end">
          <button type="button" onClick={()=>replace([])}
            className="mb-1 flex transform-gpu font-medium text-primary transition-all duration-300 hover:text-blue-400 hover:text-bule-400 active:scale-95 disabled:bg-slate-500"
            >Reset</button>
        </div>
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="w-[30px] px-2 py-4 font-medium text-black dark:text-white xl:pl-8">
                  S.NO
                </th>
                <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                  Test Parameter Name
                </th>
                <th className="w-[100px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                  QTY
                </th>
                <th className="w-[100px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                  Test Type
                </th>
                <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                  Method / Spec
                </th>
                <th className="w-[100px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
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
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-8">
                    <h5 className="font-medium text-black dark:text-white">
                      {idx + 1}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
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
  
                    <Select
                      name={`${arrayFieldName}.${idx}.test_params_id`}
                      register={register}
                    >
                      <option value="">------------</option>
                      {data?.map((parameter) => (
                        <option value={parameter.id} key={parameter.id}>
                          {parameter.testing_parameters}
                        </option>
                      ))}
                    </Select>
                  </td>
                  <td className="border-b border-[#eee] px-1 py-3 pl-9 dark:border-strokedark xl:pl-11">
                    <input
                      type="text"
                      {...register(`${arrayFieldName}.${idx}.quantity`)}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 pl-1 pr-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {testTypesName[idx]}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {methods[idx]}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                    <input
                      type="text"
                      {...register(`testing_details.${idx}.priority_order`)}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
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
                parameter_id: "",
                priority_order: fields.length + 1,
              })
            }
          >
            Add Test
          </button>
          <button
            type="button"
            className="mt-2 flex w-1/5 transform-gpu items-center justify-center rounded border-2 border-primary p-3 font-medium text-black transition-all duration-300 hover:bg-primary hover:text-white active:scale-95 disabled:bg-slate-500"
            onClick={addAllTestParameters
            }
          >
            Add All
          </button>
          </div>
  
        </div>
      </div>
    );
  
};

export default RegistrationEditForm;
