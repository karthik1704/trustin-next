"use client";
import { SERVER_API_URL } from "@/app/constant";
import { useDeferredValue, useEffect, useState } from "react";
import {
  useFieldArray,
  useForm,
  useWatch,
  Form,
  FieldValues,
} from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2 } from "lucide-react";
import { createRegistration } from "../actions";
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
  CreateData,
  Data,
  ParametersType,
  SampleRecord,
  TestType,
} from "../typings";
import { TestDetail, TestReportForm } from "@/app/trf/typings";
import Select from "@/components/select-input";
import { FullParametersType } from "@/types/parametets";

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

const RegistrationForm = ({ data }: { data: Data }) => {
  const form = useForm<CreateData>({
    defaultValues: {
      branch_id: "1",
      date_of_received: new Date().toISOString().split('T')[0],
      no_of_samples: 0,
      test_params: [],
      samples: [],
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

  // const watchTestTypeId = useWatch({
  //   control: form.control,
  //   name: "test_type_id",
  // });
  const watchProductId = useWatch({
    control: form.control,
    name: "product_id",
  });

  // const watchNoOfSamplesValue = useWatch({
  //   control: form.control,
  //   name: "no_of_samples",
  // });

  // const defferdSampleNO = useDeferredValue(watchNoOfSamplesValue);

  const [filterId, setFilterId] = useState("1");
  const [parameters, setParameters] = useState<FullParametersType[]>([]);

  const [state, setState] = useState<InitialState | undefined>(initialState);
  const router = useRouter();

  // useEffect(() => {
  //   // TODO: need some imporvement in future
  //   // const ids = sampleWatch.map((field, idx) => field.test_type_id);
  //   if (watchTestTypeId) setFilterId(watchTestTypeId.toString());
  // }, [watchTestTypeId]);

  useEffect(() => {
    async function fetchTestParameters(query: string, product: string) {
      let res = await fetch(
        `${SERVER_API_URL}/parameters/product/${product}?${query}`,
      );
      const response: any = await res.json();
      setParameters(response);
    }

    if ( watchProductId) {
      const query = `test_type=${encodeURIComponent('2')}`;

        fetchTestParameters(query, watchProductId.toString());
      // if (filterId === "1") {
      //   const micro_params =
      //     data?.parameters?.filter(
      //       (test: any) => test.test_type_id.toString() === "1",
      //     ) ?? [];
      //   if (micro_params.length) setParameters(micro_params);
      // }
    }
  }, [data?.parameters,  watchProductId]);

  // useEffect(() => {
  //   if (defferdSampleNO) {
  //     if (defferdSampleNO.toString() === "0") {
  //       replace([]);
  //     }
  //     if (defferdSampleNO > 0) {
  //       replace([]);
  //       for (let i = 0; i < defferdSampleNO; i++) {
  //         append({
  //           sample_name: form.getValues("sample_name") + " -" + (i + 1),
  //           batch_or_lot_no: form.getValues("batch_or_lot_no"),
  //           manufactured_date: form.getValues("manufactured_date"),
  //           expiry_date: form.getValues("expiry_date"),
  //           batch_size: form.getValues("batch_size"),
  //           received_quantity: form.getValues("received_quantity"),
  //         });
  //       }

  //     }
  //   }
  // }, [append, form, replace, defferdSampleNO]);

  const createSamples = () => {
    const number = +form.getValues("no_of_samples");
    console.log(fields.length, number);
    if (number === fields.length) return;
    if (number) {
      if (number.toString() === "0") {
        replace([]);
      }
      if (number > 0) {
        replace([]);
        for (let i = 0; i < number; i++) {
          append({
            sample_name: form.getValues("sample_name") + " -" + (i + 1),
            batch_or_lot_no: form.getValues("batch_or_lot_no"),
            manufactured_date: form.getValues("manufactured_date"),
            expiry_date: form.getValues("expiry_date"),
            batch_size: form.getValues("batch_size"),
            received_quantity: form.getValues("received_quantity"),
          });
        }
      }
    }
  };

  useEffect(() => {
    // Make API call when the watched field value changes
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
  }, [watchCompanyFieldValue, form.setValue, form, data.customers]);

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

  const handleForm = async (data: CreateData) => {
    console.log(data);
    const res = await createRegistration(data);
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
                required
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
                  required
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

          {/* <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
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
          </div> */}

          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black dark:text-white">
                License No
              </label>
              <input
                {...form.register("license_no")}
                placeholder="Enter License No"
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
                required
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
                required
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
                required
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
                required
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
                required
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
                required
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
              <TabsTrigger value="mech-parameters">
                Mech Parameters
              </TabsTrigger>
              <TabsTrigger value="micro-parameters">
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
                      </div>
                      <Select
                        name={`samples.${index}.test_type_id`}
                        label="Test Type"
                        register={form.register}
                        width={"w-full xl:w-1/6"}
                      >
                        <option value="1">Micro</option>
                        <option value="2">Mech</option>
                      </Select>
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
                data={parameters}
                filterId={filterId}
                arrayFieldName="mech_params"
              />
            </TabsContent>
            <TabsContent value="micro-parameters">
              <TestParamsForm
                control={form.control}
                register={form.register}
                data={data?.microParameters ?? []}
                filterId={filterId}
                arrayFieldName="micro_params"
              />
            </TabsContent>
          </Tabs>

          <button
            type="submit"
            className="mt-4 flex w-full transform-gpu justify-center rounded bg-primary p-3 font-medium text-gray transition-all duration-300 hover:bg-blue-500 active:scale-95 disabled:bg-slate-500"
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
  data,
  filterId,
  arrayFieldName,
}: {
  control: any;
  register: any;
  data: FullParametersType[];
  filterId: [] | number | string;
  arrayFieldName: string;
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

  useEffect(() => {
    if (data.length) {
      replace([]);
      data.forEach((para, idx) =>
        append({
          test_params_id: para.id,
          order: idx + 1,
        }),
      );
    }
  }, [data, append, replace]);

  useEffect(() => {
    const ids =
      test_watch?.map((field: any) => {
        if (field.test_params_id !== "") return field.test_params_id.toString();
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
    if (data.length) {
      replace([]);
      data.forEach((para, idx) =>
        append({
          test_params_id: para.id,
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
                    {...register(`${arrayFieldName}.${idx}.order`)}
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
                test_params_id: "",
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

export default RegistrationForm;
