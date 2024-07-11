"use client";
import { SERVER_API_URL } from "@/app/constant";
import { useEffect, useState } from "react";
import {
  useFieldArray,
  useForm,
  useWatch,
  Form,
  Controller,
} from "react-hook-form";
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
import ComboBox2 from "@/components/combo-box/combo-box2";
import Link from "next/link";

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
      // trf_code: data?.registration?.trf_code,
      // branch_id: data?.registration?.branch_id,
      front_desk_id: data?.registration?.front_desk_id ?? "",
      product_id: data?.registration?.product_id,
      company_id: data?.registration?.company_id,
      full_address: data?.registration?.full_address,
      company_name: data?.registration?.company_name,
      // customer_address_line2: data?.registration?.customer_address_line2,
      // city: data?.registration?.city,
      // state: data?.registration?.state,
      // pincode_no: data?.registration?.pincode_no,
      gst: data?.registration?.gst,
      date_of_received: new Date(data?.registration?.date_of_received)
        .toISOString()
        .split("T")[0],
      // test_type_id: data?.registration?.test_type_id,
      // nabl_logo: data?.registration?.nabl_logo ? "1" : "0",
      license_no: data?.registration?.license_no,
      testing_process: data?.registration?.testing_process,
      sampled_by: data?.registration?.sampled_by,
      sample_disposal_process: data?.registration?.sample_disposal_process,
      reports_send_by: data?.registration?.reports_send_by,

      // sample_name: data?.registration?.sample_name,
      // batch_or_lot_no: data?.registration?.batch_or_lot_no,
      // manufactured_date: new Date(data?.registration?.manufactured_date)
      //   .toISOString()
      //   .split("T")[0],
      // expiry_date: new Date(data?.registration?.expiry_date)
      //   .toISOString()
      //   .split("T")[0],
      // batch_size: data?.registration?.batch_size,
      // received_quantity: data?.registration?.received_quantity,
      // no_of_samples: data?.registration?.no_of_samples,
      no_of_batches: data?.registration?.no_of_batches,
      status: data?.registration?.status,
      // controlled_quantity: data?.registration?.controlled_quantity,
      samples:
        data?.registration?.samples?.map((sample) => ({
          id: sample.id,
          sample_name: sample.sample_name,
          batch_or_lot_no: sample.batch_or_lot_no,
          manufactured_date: sample.manufactured_date
            ? new Date(sample.manufactured_date).toISOString().split("T")[0]
            : "",
          expiry_date: sample.expiry_date
            ? new Date(sample.expiry_date).toISOString().split("T")[0]
            : "",
          tat: sample.tat
            ? new Date(sample.tat).toISOString().split("T")[0]
            : "",
          batch_size: sample.batch_size,
          received_quantity: sample.received_quantity,
          description: sample?.description ?? "",
          test_type_id: sample.test_type_id.toString(),
          test_params: sample.sample_test_parameters.map((test) => ({
            test_params_id: test.test_parameter_id,
            order: test.order,
          })),
        })) ?? [],
      // micro_params: data?.registration?.test_params
      //   ?.filter((para) => para.test_parameter.test_type_id === 1)
      //   .map((test) => ({
      //     test_params_id: test.test_params_id,
      //     order: test.order,
      //     quantity: test.quantity,
      //   })),
      // mech_params: data?.registration?.test_params
      //   ?.filter((para) => para.test_parameter.test_type_id === 2)
      //   .map((test) => ({
      //     test_params_id: test.test_params_id,
      //     order: test.order,
      //     quantity: test.quantity,
      //   })),
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "samples", // Name of the array in your schema
  });

  // const watchCompanyFieldValue = useWatch({
  //   control: form.control,
  //   name: "company_id",
  // });
  const watchFrontDesk = useWatch({
    control: form.control,
    name: "front_desk_id",
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

  // const watchMicroParams = useWatch({
  //   control: form.control,
  //   name: "micro_params",
  // });
  // const watchMechParams = useWatch({
  //   control: form.control,
  //   name: "mech_params",
  // });
  // const watchReceivedQuantiy = useWatch({
  //   control: form.control,
  //   name: "received_quantity",
  // });
  // const watchControlledQuantity = useWatch({
  //   control: form.control,
  //   name: "controlled_quantity",
  // });
  const watchSamples = useWatch({
    control: form.control,
    name: "samples",
  });

  // const [filterId, setFilterId] = useState(
  //   data?.registration?.test_type_id.toString(),
  // );
  const [parameters, setParameters] = useState<FullParametersType[]>(
    data?.parameters ?? [],
  );
  const [sampleStatus, setSampleStatus] = useState<(number | null)[]>([]);
  const [sampleCode, setSampleCode] = useState<(string | null)[]>([]);
  const [sampleIds, setSampleIds] = useState<(number | null)[]>([]);
  const [samplsTestType, setSampleTestType] = useState<(string | number)[]>([]);

  const [state, setState] = useState<InitialState | undefined>(initialState);
  const router = useRouter();

  // useEffect(() => {
  //   // TODO: need some imporvement in future
  //   // const ids = sampleWatch.map((field, idx) => field.test_type_id);
  //   if (watchTestTypeId) setFilterId(watchTestTypeId.toString());
  // }, [watchTestTypeId]);

  useEffect(() => {
    if (
      watchFrontDesk.toString() === data?.registration?.front_desk_id.toString()
    )
      return;

    if (!watchFrontDesk) return;

    const frontDesk = data?.frontDesks?.find(
      (desk) => desk.id.toString() === watchFrontDesk.toString(),
    );
    form.setValue("company_id", frontDesk?.customer_id.toString() ?? "");
    const customer = data.customers.find(
      (customer) =>
        customer.id.toString() === frontDesk?.customer_id.toString(),
    );
    const addresss = customer?.customer_address_line1.split(",") ?? "";
    console.log(addresss);
    form.setValue("company_name", customer?.company_name ?? "");
    form.setValue("full_address", customer?.customer_address_line1 ?? "");
    // form.setValue("city", customer?.city ?? "");
    // form.setValue("state", customer?.state ?? "");
    // form.setValue("pincode_no", customer?.pincode_no ?? "");
    // form.setValue(
    //   "customer_address_line1",
    //   customer?.customer_address_line1 ?? "",
    // );
    // form.setValue(
    //   "customer_address_line2",
    //   customer?.customer_address_line2 ?? "",
    // );
    form.setValue("gst", customer?.gst ?? "");
  }, [
    data.customers,
    data?.frontDesks,
    data?.registration?.front_desk_id,
    form,
    watchFrontDesk,
  ]);

  // useEffect(() => {
  //   // if (
  //   //   data.registration.controlled_quantity.toString() ===
  //   //   watchControlledQuantity.toString()
  //   // )
  //   //   return;
  //   const usedMechQuantity = watchMechParams.reduce(
  //     (acc, field, idx) => acc + +field.quantity,
  //     0,
  //   );
  //   const usedMicroQuantity = watchMicroParams.reduce(
  //     (acc, field, idx) => acc + +field.quantity,
  //     0,
  //   );

  //   const totalUsedQuantity = usedMechQuantity + usedMicroQuantity;

  //   const receivedQuantity = +form.getValues("received_quantity") ?? 0;
  //   const constrolledQuantiy = receivedQuantity - totalUsedQuantity;
  //   console.log("HI");
  //   form.setValue("controlled_quantity", constrolledQuantiy);
  //   if (constrolledQuantiy < 0) {
  //     toast.error(
  //       "Assinged Quantities higher than recieved quantity, Please Check test params quantity ",
  //       {
  //         duration: 5000,
  //         closeButton: true,
  //       },
  //     );
  //   }
  // }, [
  //   data.registration.controlled_quantity,
  //   form,
  //   // watchControlledQuantity,
  //   watchMechParams,
  //   watchMicroParams,
  //   watchReceivedQuantiy,
  // ]);
  // useEffect(() => {
  //   async function fetchTestParameters(query: string, product: string) {
  //     console.log("here");
  //     let res = await fetch(`/api/registrations/parameters/?${query}`);
  //     const response: any = await res.json();
  //     setParameters(response);
  //   }

  //   if (watchProductId) {
  //     const query = `product=${encodeURIComponent(watchProductId.toString())}&test_type=${encodeURIComponent("2")}`;

  //     fetchTestParameters(query, watchProductId.toString());
  //   }
  // }, [data?.parameters, watchProductId]);

  // useEffect(() => {
  //   const {
  //     sample_name,
  //     batch_or_lot_no,
  //     manufactured_date,
  //     expiry_date,
  //     batch_size,
  //     received_quantity,
  //   } = form.getValues();

  //   if (watchNoOfSamplesValue !== data?.registration.no_of_samples) {
  //     if (watchNoOfSamplesValue === 0) {
  //       replace([]);
  //     } else if (watchNoOfSamplesValue > 0) {
  //       const extraSamples = Math.abs(
  //         data?.registration?.no_of_samples - watchNoOfSamplesValue,
  //       );
  //       console.log(extraSamples);

  //       let fieldsLength = fields.length;

  //       for (let i = 0; i < extraSamples; i++) {
  //         if (fieldsLength === watchNoOfSamplesValue) break;
  //         append({
  //           id: null,
  //           sample_name: `${sample_name} ${fieldsLength + i}`,

  //           batch_or_lot_no,
  //           manufactured_date,
  //           expiry_date,
  //           batch_size,
  //           received_quantity,
  //         });
  //       }
  //     }
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [
  //   append,
  //   data?.registration.no_of_samples,
  //   form,
  //   replace,
  //   watchNoOfSamplesValue,
  // ]);
  useEffect(() => {
    const ids = watchSamples.map((field, idx) => field.test_type_id) ?? [];

    if (ids.length) {
      setSampleTestType(ids);
    }
  }, [watchSamples]);

  useEffect(() => {
    const ids = watchSamples.map((field) => field.id) ?? [];
    if (ids.length) {
      // const statusIds = data?.registration?.samples?.map((sample) => {
      //   if (ids.includes(sample.id)) {
      //     return sample.status_id;
      //   }
      // });
      const statusIds: (number | null)[] = [];
      const sampleIds: (string | null)[] = [];
      const sIds: (number | null)[] = [];

      ids.forEach((id: number | string) => {
        const statusId =
          data?.registration?.samples?.find((t) => t.id === id)?.status_id ??
          null;
        statusIds.push(statusId);
      });

      console.log(statusIds);
      setSampleStatus(statusIds);

      ids.forEach((id: number | string) => {
        const sample =
          data?.registration?.samples?.find((t) => t.id === id) ?? null;
        sampleIds.push(sample?.sample_id ?? null);
        sIds.push(sample?.id ?? null);
      });

      console.log(sampleIds);
      setSampleCode(sampleIds);
      setSampleIds(sIds);
    }
  }, [data?.registration?.samples, watchSamples]);

  // const createSamples = () => {
  //   const {
  //     sample_name,
  //     batch_or_lot_no,
  //     manufactured_date,
  //     expiry_date,
  //     batch_size,
  //     received_quantity,
  //   } = form.getValues();

  //   if (watchNoOfSamplesValue !== data?.registration.no_of_samples) {
  //     if (watchNoOfSamplesValue === 0) {
  //       replace([]);
  //     } else if (watchNoOfSamplesValue > 0) {
  //       const extraSamples = watchNoOfSamplesValue - fields.length;
  //       console.log(extraSamples);
  //       if (extraSamples < 0) {
  //         toast.error("No of samples can't be lower than previous value", {
  //           duration: 5000,
  //           closeButton: true,
  //         });
  //         form.setValue("no_of_samples", fields.length);
  //         return;
  //       }
  //       let fieldsLength = fields.length;

  //       for (let i = 0; i < extraSamples; i++) {
  //         if (fieldsLength === watchNoOfSamplesValue) break;
  //         append({
  //           id: null,
  //           sample_name: `${sample_name} - ${fieldsLength + 1}`,
  //           batch_or_lot_no,
  //           manufactured_date,
  //           expiry_date,
  //           batch_size,
  //           received_quantity: received_quantity,
  //         });
  //       }
  //     }
  //   }
  // };

  // useEffect(() => {
  //   // Make API call when the watched field value changes
  //   if (
  //     watchCompanyFieldValue.toString() ===
  //     data?.registration?.company_id.toString()
  //   )
  //     return;

  //   const getCompanyDetail = (company_id: any) => {
  //     const customer = data.customers.find(
  //       (customer) => customer.id.toString() === company_id,
  //     );
  //     form.setValue("company_name", customer?.company_name ?? "");
  //     form.setValue("city", customer?.city ?? "");
  //     form.setValue("state", customer?.state ?? "");
  //     form.setValue("pincode_no", customer?.pincode_no ?? "");
  //     form.setValue(
  //       "customer_address_line1",
  //       customer?.customer_address_line1 ?? "",
  //     );
  //     form.setValue(
  //       "customer_address_line2",
  //       customer?.customer_address_line2 ?? "",
  //     );
  //     form.setValue("gst", customer?.gst ?? "");
  //   };

  //   // Check if the field value is not empty before making the API call
  //   if (watchCompanyFieldValue) {
  //     const company_id = watchCompanyFieldValue;
  //     if (company_id) getCompanyDetail(company_id);
  //   }
  // }, [
  //   watchCompanyFieldValue,
  //   form.setValue,
  //   form,
  //   data.customers,
  //   data?.registration?.company_id,
  // ]);

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

  const addSample = () => {
    if (fields.length !== 0) {
      const sample = form.getValues("samples").at(-1);
      if (sample) {
        append({
          id: "",
          sample_name: `${sample.sample_name} -${fields.length + 1}`,
          batch_or_lot_no: sample.batch_or_lot_no,
          test_type_id: "1",
          manufactured_date: sample.manufactured_date,
          expiry_date: sample.expiry_date,
          tat: sample.tat,
          batch_size: sample.batch_size,
          received_quantity: sample.received_quantity,
          description: sample.description,
          test_params: [],
        });
      }
      return;
    }
    append({
      id: "",
      sample_name: "",
      batch_or_lot_no: "",
      test_type_id: "1",
      manufactured_date: null,
      expiry_date: null,
      tat: null,
      batch_size: undefined,
      received_quantity: 0,
      description: "",
      test_params: [],
    });
  };

  const handleForm = async (data: UpdateData) => {
    console.log(data);
    if (data.samples.length === 0) {
      toast.error("Registratin must contain at least 1 sample", {
        duration: 10000,
        closeButton: true,
      });
      return;
    }
    let isError = false;
    data.samples.forEach((sample) => {
      if (sample.test_params.length === 0) {
        toast.error(
          `${sample.sample_name} must contain Test Parameter, Please check.`,
          {
            duration: 10000,
            closeButton: true,
          },
        );
        isError = true;
        return;
      }
    });

    if (isError) return;

    const res = await updateFn(data);
    console.log(res);
    setState(res);
  };
  return (
    <UiForm {...form}>
      <form onSubmit={form.handleSubmit(handleForm)}>
        <div className="p-6.5">
          {/* <div className="mb-4.5 flex flex-col gap-6 xl:flex-row ">
            <div className="w-full xl:w-9/12">
              <label className="mb-2.5 block text-black dark:text-white">
                TRF Code
              </label>
              <input
                type="hidden"
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
          </div> */}

          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <Select
              name="front_desk_id"
              register={form.register}
              label={"Front Desk"}
              disabled
            >
              {" "}
              <option value="">------------</option>
              {data.frontDesks.map((t) => (
                <option value={t.id} key={t.id}>
                  {t.customer.company_name} -{" "}
                  {new Date(t.date_of_received).toDateString()}
                </option>
              ))}
            </Select>
          </div>

          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            {/* <div className="w-full xl:w-9/12">
              <label className="mb-2.5 block text-black dark:text-white">
                Company ID
              </label>

              <div className="relative z-20 bg-transparent dark:bg-form-input">
             
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
            </div> */}
            <div className="w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Company Name
              </label>
              <input type="hidden" {...form.register("company_id")} />

              <input
                type="text"
                readOnly={true}
                {...form.register("company_name")}
                placeholder="Enter Company Name"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
          </div>
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Full Address
              </label>

              <textarea
                readOnly={true}
                {...form.register("full_address")}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
          </div>

          {/* <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
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
          </div> */}

          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Gst No.
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
                readOnly={true}
                {...form.register("date_of_received")}
                placeholder="Enter Date Of Recived"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
          </div>

          {/* <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
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
          </div> */}
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Product
              </label>
              <Controller
                name="product_id"
                control={form.control}
                render={({ field: { onChange, value, onBlur } }) => (
                  <ComboBox2
                    name="product_id"
                    register={form.register}
                    data={data.products.map((t) => ({
                      name: t.product_name,
                      value: t.id,
                    }))}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                  />
                )}
              />
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
            <div className="w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Manufacturer License No.
              </label>
              <input
                {...form.register("license_no")}
                placeholder="Enter Licese No"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
            {/* <Select
              name="nabl_logo"
              label="NABL Logo"
              register={form.register}
              width={"w-full xl:w-1/2"}
            >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </Select> */}
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
              <option value="EMAIL_COURIER">EMAIL AND COURIER</option>
            </Select>
          </div>

          {/* <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
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
          </div> */}
          {/* <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
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
          </div> */}

          {/* <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Batch/Lot Size
              </label>
              <input
                {...form.register("batch_size")}
                placeholder="Enter Batch Size"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div> */}
          {/* <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black dark:text-white">
                Received Quantity
              </label>
              <input
                {...form.register("received_quantity")}
                placeholder="Enter Received Quantity"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div> */}
          {/* </div> */}

          {/* <div className="mb-4.5 flex flex-col gap-6 xl:flex-col">
            <div className="w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Controlled Quantity
              </label> */}
          {/* <input
            type="hidden"
            {...form.register("controlled_quantity")}
            placeholder="Enter Controlled quantity"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          /> */}
          {/* </div>
          </div> */}
          {/* <div className="mb-4.5 flex flex-col gap-6 xl:flex-col">
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
          </div> */}
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-col">
            <div className="w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                No. of Batches
              </label>
              <input
                required
                {...form.register("no_of_batches")}
                placeholder="Enter No of Batches"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
          </div>
          <div className="mb-4.5">
            <div className="w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Status
              </label>
              <input
                readOnly={true}
                {...form.register("status")}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
          </div>

          <Tabs defaultValue="samples" className="w-full">
            <TabsList>
              <TabsTrigger value="samples">Samples</TabsTrigger>
              {/* <TabsTrigger value="mech-parameters">Mech Parameters</TabsTrigger>
              <TabsTrigger value="micro-parameters">
                Micro Parameters
              </TabsTrigger> */}
            </TabsList>
            <TabsContent value="samples">
              <div className="mb-4 pb-4">
                {fields.map((item, index) => (
                  <div key={item.id} className="mb-4 mt-2">
                    <div className="mb-2 flex justify-between border-b-2">
                      <p>
                        Sample{" "}
                        <strong>
                          #{index + 1}:{" "}
                          {sampleCode[index] ? (
                            <Link
                              href={`/dashboard/samples/${sampleIds[index]}/`}
                            >
                              {sampleCode[index]}
                            </Link>
                          ) : (
                            "--"
                          )}{" "}
                        </strong>
                      </p>
                      <div>
                        {sampleStatus[index] === null ||
                        sampleStatus[index] === 1 ? (
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
                        ) : (
                          <p className="text-muted-foreground">
                            This sample moved to next stage, Edit and remove
                            don&apos;t apply
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mb-4.5 flex flex-col gap-3 xl:flex-row xl:flex-wrap">
                      <div className="w-full xl:w-1/4">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Sample Name <span className="text-meta-1">*</span>
                        </label>
                        <input
                          {...form.register(`samples.${index}.id`)}
                          type="hidden"
                        />
                        <input
                          required
                          {...form.register(`samples.${index}.sample_name`)}
                          placeholder="Enter Sample Name"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                        <input
                          type="hidden"
                          {...form.register(`samples.${index}.id`)}
                        />
                      </div>

                      <Select
                        name={`samples.${index}.test_type_id`}
                        label="Test Type"
                        register={form.register}
                        width={"w-full xl:w-1/4"}
                      >
                        <option value="1">Micro</option>
                        <option value="2">Mech</option>
                      </Select>

                      <div className="w-full xl:w-1/4">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Batch / Lot No.{" "}
                        </label>
                        <input
                          required
                          {...form.register(`samples.${index}.batch_or_lot_no`)}
                          placeholder="Enter Batch or Lot No"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                      </div>

                      <div className="w-full xl:w-1/4">
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

                      <div className="w-full xl:w-1/4">
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

                      <div className="w-full xl:w-1/4">
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
                      <div className="w-full xl:w-1/4">
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

                      <div className="w-full xl:w-1/4">
                        <label className="mb-2.5 block text-black dark:text-white">
                          TAT
                        </label>
                        <input
                          {...form.register(`samples.${index}.tat`)}
                          type="date"
                          placeholder="Enter Turn Around Time"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                      </div>
                    </div>
                    <div className="mb-4.5">
                      <div className="w-full">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Description
                        </label>
                        <textarea
                          {...form.register(`samples.${index}.description`)}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                      </div>
                    </div>
                    <TestParamsForm
                      control={form.control}
                      register={form.register}
                      data={data.parameters ?? []}
                      filterId={samplsTestType[index]}
                      arrayFieldName={`samples.${index}.test_params`}
                      productId={watchProductId}
                    />
                    <hr />
                  </div>
                ))}

                <button
                  type="button"
                  className="relative flex w-1/5 transform-gpu items-center justify-center rounded border-2 border-primary p-3 font-medium text-black transition-all duration-300 hover:bg-primary hover:text-white active:scale-95 disabled:bg-slate-500"
                  onClick={addSample}
                >
                  Add Samples
                </button>
              </div>
            </TabsContent>
            {/* <TabsContent value="mech-parameters">
              <TestParamsForm
                control={form.control}
                register={form.register}
                data={
                  data?.registration?.test_params?.filter(
                    (para) => para.test_parameter.test_type_id === 2,
                  ) ?? []
                }
                filterId={2}
                arrayFieldName="mech_params"
                parameters={parameters ?? []}
                allData={data}
              />
            </TabsContent>
            <TabsContent value="micro-parameters">
              <TestParamsForm
                control={form.control}
                register={form.register}
                data={
                  data?.registration?.test_params?.filter(
                    (para) => para.test_parameter.test_type_id === 1,
                  ) ?? []
                }
                filterId={1}
                arrayFieldName="micro_params"
                parameters={data.microParameters ?? []}
                allData={data}
              />
            </TabsContent> */}
          </Tabs>

          <button
            type="submit"
            className="mt-10 flex w-full justify-center rounded bg-primary p-3 font-medium text-gray disabled:bg-slate-500"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Loading..." : "Submit"}
          </button>
        </div>
      </form>
    </UiForm>
  );
};

// const TestParamsForm = ({
//   control,
//   register,
//   parameters,
//   data,
//   allData,
//   filterId,
//   arrayFieldName,
// }: {
//   control: any;
//   register: any;
//   parameters: FullParametersType[];
//   data: TestParameter[];
//   allData: UpdateDataType;
//   filterId: [] | number | string;
//   arrayFieldName: string;
// }) => {
//   const { fields, append, remove, replace } = useFieldArray({
//     control,
//     name: arrayFieldName,
//   });

//   const test_watch = useWatch({
//     control: control,
//     name: arrayFieldName,
//   });

//   const [testTypesName, setTestTypesName] = useState<string[]>([]);
//   const [methods, setMethods] = useState<string[]>([]);

//   // useEffect(() => {
//   //   // if (allData.registration.test_type_id.toString() !== filterId) {
//   //   //   if (parameters.length) {
//   //   //     replace([]);
//   //   //     parameters.forEach((para, idx) =>
//   //   //       append({
//   //   //         test_params_id: para.id,
//   //   //         order: idx + 1,
//   //   //       }),
//   //   //     );
//   //   //   }
//   //   //   return;
//   //   // }
//   //   console.log('Im runing')
//   //   if (parameters && parameters?.length) {
//   //     replace([]);
//   //     data.forEach((para, idx) =>
//   //       append({
//   //         test_params_id: para.test_params_id,
//   //         order: para.order,
//   //         quantity: para.quantity
//   //       }),
//   //     );
//   //   }
//   // }, [
//   //   data,
//   //   append,
//   //   replace,
//   //   parameters,
//   // ]);

//   useEffect(() => {
//     const ids =
//       test_watch?.map((field: any) => {
//         if (field.test_params_id !== "") return field.test_params_id.toString();
//       }) ?? [];
//     console.log(ids);

//     if (ids.length) {
//       const tests = parameters.filter((para) =>
//         ids.includes(para.id.toString()),
//       );

//       console.log(tests);

//       const test_names: string[] = [];

//       ids.forEach((id: string) => {
//         const test_name =
//           tests?.find((t) => t.id.toString() === id)?.test_type?.name ??
//           undefined;
//         if (test_name) test_names.push(test_name);
//       });

//       const methods: string[] = [];
//       ids.forEach((id: any) => {
//         const method =
//           tests?.find((t) => t.id.toString() === id)?.method_or_spec ??
//           undefined;
//         if (method) methods.push(method);
//       });
//       console.log(test_names);

//       setTestTypesName(test_names);
//       setMethods(methods);
//     }
//   }, [data, test_watch, parameters]);

//   const addAllTestParameters = () => {
//     if (data.length) {
//       replace([]);
//       data.forEach((para, idx) =>
//         append({
//           test_params_id: para.id,
//           order: idx + 1,
//         }),
//       );
//     }
//   };

//   return (
//     <div className="rounded-sm border border-stroke bg-white px-2 pb-2.5 pt-2 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-3.5 xl:pb-1">
//       <div className="flex justify-end">
//         <button
//           type="button"
//           onClick={() => replace([])}
//           className="hover:text-bule-400 mb-1 flex transform-gpu font-medium text-primary transition-all duration-300 hover:text-blue-400 active:scale-95 disabled:bg-slate-500"
//         >
//           Reset
//         </button>
//       </div>
//       <div className="max-w-full overflow-x-auto">
//         <table className="w-full table-auto">
//           <thead>
//             <tr className="bg-gray-2 text-left dark:bg-meta-4">
//               <th className="w-[30px] px-2 py-4 font-medium text-black dark:text-white xl:pl-8">
//                 S.NO
//               </th>
//               <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
//                 Test Parameter Name
//               </th>
//               <th className="w-[100px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
//                 QTY
//               </th>

//               <th className="w-[100px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
//                 Test Type
//               </th>
//               <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
//                 Method / Spec
//               </th>
//               <th className="w-[100px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
//                 Priority Order
//               </th>
//               <th className="w-[100px] px-2 py-4 font-medium text-black dark:text-white xl:pl-6">
//                 Remove?
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {fields.map((item, idx) => (
//               <tr key={item.id}>
//                 <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-8">
//                   <h5 className="font-medium text-black dark:text-white">
//                     {idx + 1}
//                   </h5>
//                 </td>
//                 <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
//                   {/* <h5 className="font-medium text-black dark:text-white">
//                     {
//                       data.trf?.test_details?.[idx]?.parameter
//                         ?.testing_parameters
//                     }
//                   </h5>
//                   <input
//                     type="hidden"
//                     {...form.register(
//                       `testing_details.${idx}.parameter_id`
//                     )}
//                     className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
//                   /> */}

//                   <Select
//                     name={`${arrayFieldName}.${idx}.test_params_id`}
//                     register={register}
//                   >
//                     <option value="">------------</option>
//                     {parameters?.map((parameter) => (
//                       <option value={parameter.id} key={parameter.id}>
//                         {parameter.testing_parameters}
//                       </option>
//                     ))}
//                   </Select>
//                 </td>
//                 <td className="border-b border-[#eee] px-1 py-3 pl-9 dark:border-strokedark xl:pl-11">
//                   <input
//                     type="text"
//                     {...register(`${arrayFieldName}.${idx}.quantity`)}
//                     className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 pl-1 pr-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
//                   />
//                 </td>
//                 <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
//                   <h5 className="font-medium text-black dark:text-white">
//                     {testTypesName[idx]}
//                   </h5>
//                 </td>
//                 <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
//                   <h5 className="font-medium text-black dark:text-white">
//                     {methods[idx]}
//                   </h5>
//                 </td>
//                 <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
//                   <input
//                     type="text"
//                     {...register(`${arrayFieldName}.${idx}.order`)}
//                     className="w-full rounded border-[1.5px] border-stroke bg-transparent px-2 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
//                   />
//                 </td>
//                 <td className="border-b border-[#eee] px-2 py-5 pl-6 dark:border-strokedark xl:pl-6">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       remove(idx);
//                     }}
//                   >
//                     <Trash2 />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <div className="flex gap-4">
//           <button
//             type="button"
//             className="mt-2 flex w-1/5 transform-gpu items-center justify-center rounded border-2 border-primary p-3 font-medium text-black transition-all duration-300 hover:bg-primary hover:text-white active:scale-95 disabled:bg-slate-500"
//             onClick={() =>
//               append({
//                 test_params_id: "",
//                 order: fields.length + 1,
//               })
//             }
//           >
//             Add Test
//           </button>
//           <button
//             type="button"
//             className="mt-2 flex w-1/5 transform-gpu items-center justify-center rounded border-2 border-primary p-3 font-medium text-black transition-all duration-300 hover:bg-primary hover:text-white active:scale-95 disabled:bg-slate-500"
//             onClick={addAllTestParameters}
//           >
//             Add All
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

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
  filterId: [] | number | string;
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
    async function fetchTestParameters(query: string, product: string) {
      // let res = await fetch(
      //   `${SERVER_API_URL}/parameters/product/${product}?${query}`,
      // );
      console.log("here");
      let res = await fetch(`/api/registrations/parameters/?${query}`);
      const response: any = await res.json();
      setParameters(response);
    }

    if (!filterId) {
      return;
    }

    if (productId) {
      if (filterId.toString() === "2") {
        const query = `product=${encodeURIComponent(productId.toString())}&test_type=${encodeURIComponent("2")}`;

        fetchTestParameters(query, productId.toString());
      }
      if (filterId.toString() === "1") {
        const micro_params =
          data?.filter((test: any) => test.test_type_id.toString() === "1") ??
          [];
        if (micro_params.length) setParameters(micro_params);
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
    if (parameters.length) {
      replace([]);
      parameters.forEach((para, idx) =>
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
              {/* <th className="w-[100px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                QTY
              </th> */}
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
                    name={`${arrayFieldName}.${idx}.test_params_id`}
                    control={control}
                    render={({ field: { onChange, value, onBlur } }) => (
                      <ComboBox2
                        name={`${arrayFieldName}.${idx}.test_params_id`}
                        data={parameters.map((t) => ({
                          name: t.testing_parameters,
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

export default RegistrationEditForm;
