"use client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  useFieldArray,
  useForm,
  useWatch,
  Form,
  FieldValues,
  Controller,
} from "react-hook-form";

import { Form as UiForm } from "@/components/ui/form";
import ComboBox2 from "@/components/combo-box/combo-box2";
import { Data } from "./typings";
import Select from "@/components/select-input";
import { Trash2 } from "lucide-react";
import { dateFormatter } from "@/lib/utils";

type props = {
  data: Data;
  actionFn: (
    data: FormValues,
  ) => Promise<
    { fieldErrors: null; type: string; message: string | undefined } | undefined
  >;
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
type FormValues = {
  invoice_mode: 'INVOICE' | 'PROFORMA_INVOICE';
  company_name: string;
  discount: number | undefined;
  invoice_type: string;
  currency: string;
  tested_type: string;
  customer_id: string | number;
  customer_address: string;
  contact_person_name: string;
  contact_phone: string;
  customer_email: string;
  customer_gst: string;
  customer_ref_no: string;
  quotation_ref_no: string;
  sample_id_nos: string;
  parameters: {
    id: number;
    test_parameter: string;
    sac: string;
    testing_charge: number;
    no_of_tested: number;
    total_testing_charge: number;
  }[];
};

const InvoiceEditForm = ({ data, actionFn }: props) => {
  const form = useForm<FormValues>({
    defaultValues: {
      invoice_mode: data.invoice.invoice_mode || "",
      company_name: data.invoice.customer.company_name || "",
      discount: Number(data.invoice.discount) || 0,
      invoice_type: data.invoice.invoice_type || "",
      currency: data.invoice.currency || "",
      tested_type: data.invoice.tested_type || "",
      customer_id: data.invoice.customer_id || "",
      customer_address: data.invoice.customer_address || "",
      contact_person_name: data.invoice.contact_person_name || "",
      contact_phone: data.invoice.contact_phone || "",
      customer_email: data.invoice.customer_email || "",
      customer_gst: data.invoice.customer_gst || "",
      customer_ref_no: data.invoice.customer_ref_no || "",
      quotation_ref_no: data.invoice.quotation_ref_no || "",
      sample_id_nos: data.invoice.sample_id_nos || "",
      parameters:
        data.invoice.invoice_parameters?.map((item) => ({
          id: item.id,
          test_parameter: item.test_parameter,
          sac: item.sac,
          testing_charge: item.testing_charge,
          no_of_tested: item.no_of_tested,
          total_testing_charge: item.total_testing_charge,
        })) || [],
    },
  });

  const watchCompanyFieldValue = useWatch({
    control: form.control,
    name: "customer_id",
  });

  const watchInvoiceMode = useWatch({
    control: form.control,
    name: "invoice_mode",
    defaultValue: data.invoice.invoice_mode,
  });

  const watchTestedType = useWatch({
    control: form.control,
    name: "tested_type",
    defaultValue: data.invoice.tested_type,
  });
  
  const watchCurrency = useWatch({
    control: form.control,
    name: "currency",
    defaultValue: data.invoice.currency,
  });

  const [state, setState] = useState<InitialState | undefined>(initialState);
  const router = useRouter();

  const isEditable = data.invoice.status_id === 1;

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
      router.push("/dashboard/invoices");
    }
  }, [state, router]);

  const handleForm = async (data: FormValues) => {
    const res = await actionFn(data);
    console.log(res);
    setState(res);
  };

  return (
    <UiForm {...form}>
      <form onSubmit={form.handleSubmit(handleForm)}>
        <div className="p-6.5">
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <Select
              name="invoice_mode"
              label="Invoice"
              register={form.register}
              width={"w-full"}
              disabled={true}
            >
              <option value="INVOICE">Invoice</option>
              <option value="PROFORMA_INVOICE">Proforma Invoice</option>
            </Select>
            <div className="w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Customer
              </label>
              <input {...form.register("customer_id")} type="hidden" />
              <input
                {...form.register("company_name")}
                type="text"
                placeholder="Enter Company Name"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                disabled={!isEditable}
                readOnly={true}
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
                {...form.register("customer_address")}
                placeholder="Enter full Address"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                disabled={!isEditable}
              />
            </div>
          </div>
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Contact Person Name
              </label>
              <input
                {...form.register("contact_person_name")}
                type="text"
                placeholder="Enter Contact Person Name"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                disabled={!isEditable}
              />
            </div>
          </div>
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Contact Phone Number
              </label>
              <input
                {...form.register("contact_phone")}
                type="text"
                placeholder="Enter Contact Phone Number"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                disabled={!isEditable}
              />
            </div>
          </div>
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Email
              </label>
              <input
                {...form.register("customer_email")}
                type="text"
                placeholder="Enter Contact  Email"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                disabled={!isEditable}
              />
            </div>
          </div>

          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Gst No.
              </label>
              <input
                {...form.register("customer_gst")}
                placeholder="Enter Gst No"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                disabled={!isEditable}
              />
            </div>
          </div>

          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Customer Reference No.
              </label>
              <input
                {...form.register("customer_ref_no")}
                placeholder="Enter Customer Reference No."
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                disabled={!isEditable}
              />
            </div>
          </div>

          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Quotation Reference No.
              </label>
              <input
                {...form.register("quotation_ref_no")}
                placeholder="Enter Quotation Reference No"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                disabled={!isEditable}
              />
            </div>
          </div>
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Sample ID Nos.
              </label>
              <input
                {...form.register("sample_id_nos")}
                placeholder="Enter Sample ID Nos"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                disabled={!isEditable}
              />
            </div>
          </div>

          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full xl:w-1/2">
              <label className="mb-2.5 block text-black dark:text-white">
                Invoice Type
              </label>
              <input
                type="text"
                {...form.register("invoice_type")}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                readOnly
              />
            </div>
            <Select
              name="currency"
              label="Currency Type"
              register={form.register}
              width={"w-full xl:w-1/2"}
              disabled={!isEditable}
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
            </Select>
          </div>

          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <Select
              name="tested_type"
              label="Tested Type"
              register={form.register}
              width={"w-full"}
              disabled={!isEditable}
            >
              <option value="BATCHES">Batches</option>
              <option value="PIECES">Pieces</option>
              <option value="LOCATION">Location</option>
            </Select>
          </div>

          <TestParamsForm
            control={form.control}
            register={form.register}
            arrayFieldName="parameters"
            tested_type={watchTestedType}
            currency={watchCurrency}
            form={form}
            isEditable={isEditable}
            invoiceType={data.invoice.invoice_type}
            invoiceMode={watchInvoiceMode}
          />

          {isEditable && (
            <button
              type="submit"
              className="mt-4 flex w-full transform-gpu justify-center rounded bg-primary p-3 font-medium text-gray transition-all duration-300 hover:bg-blue-500 active:scale-95 disabled:bg-slate-500"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Loading..." : "Submit"}
            </button>
          )}
        </div>
      </form>
    </UiForm>
  );
};

export default InvoiceEditForm;

const TestParamsForm = ({
  control,
  register,
  arrayFieldName,
  tested_type,
  currency,
  form,
  isEditable,
  invoiceType,
  invoiceMode
}: {
  control: any;
  register: any;
  arrayFieldName: string;
  tested_type: string;
  currency: string;
  form: any;
  isEditable: boolean;
  invoiceType: string;
  invoiceMode: string;
}) => {
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: arrayFieldName,
  });

  const test_watch = useWatch({
    control: control,
    name: arrayFieldName,
  });
  const watchDiscount = useWatch({
    control: control,
    name: "discount",
    defaultValue: 0,
  });

  const [totals, setTotals] = useState<{ [key: number]: number }>({});
  const [subtotal, setSubtotal] = useState<number>(0);
  const [sgst, setSGST] = useState<number>(0);
  const [cgst, setCGST] = useState<number>(0);
  const [igst, setIGST] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(0);

  const calculateTotalCharges = useCallback(() => {
    if (!test_watch || !test_watch.length) return;

    let newSubtotal = 0;

    const updatedTotals = test_watch.reduce(
      (
        acc: { [x: string]: number },
        item: { testing_charge: string; no_of_tested: string },
        idx: string | number,
      ) => {
        const testingCharge = parseFloat(item.testing_charge || "0");
        const noOfTested = parseInt(item.no_of_tested || "0");
        const totalTestingCharge = (testingCharge * noOfTested).toFixed(2);

        // Only set the value if it has changed

        // Add the total charge to the running subtotal
        newSubtotal += parseFloat(totalTestingCharge);

        // Update the total for each row
        acc[idx] = parseFloat(totalTestingCharge);
        return acc;
      },
      {},
    );

    // Update the subtotal, SGST, CGST, and grand total
    setTotals(updatedTotals);
    setSubtotal(parseFloat(newSubtotal.toFixed(2)));

    // Assuming SGST and CGST are percentages, for example, 9% each
    // Calculate SGST and CGST based on invoice type
    let sgstAmount = 0;
    let cgstAmount = 0;
    let igstAmount = 0;
    if (invoiceMode === "INVOICE"){
      if (invoiceType === "TAMILNADU_CUSTOMER") {
        sgstAmount = parseFloat((newSubtotal * 0.09).toFixed(2));
        cgstAmount = parseFloat((newSubtotal * 0.09).toFixed(2));
      } else if (invoiceType === "OTHER_STATE_CUSTOMER") {
        igstAmount = parseFloat((newSubtotal * 0.18).toFixed(2));
      }
    }
   
    if (invoiceMode === "PROFORMA_INVOICE"){
      if (invoiceType === "PROFORMA_TAMILNADU_CUSTOMER") {
        sgstAmount = parseFloat((newSubtotal * 0.09).toFixed(2));
        cgstAmount = parseFloat((newSubtotal * 0.09).toFixed(2));
      } else if (invoiceType === "PROFORMA_OTHER_STATE_CUSTOMER") {
        igstAmount = parseFloat((newSubtotal * 0.18).toFixed(2));
      }
    }

    const newGrandTotal = Math.round(
      newSubtotal + sgstAmount + cgstAmount + igstAmount - (watchDiscount ?? 0),
    );

    setSGST(sgstAmount);
    setCGST(cgstAmount);
    setIGST(igstAmount);
    setGrandTotal(newGrandTotal);
  }, [invoiceMode,test_watch, invoiceType, watchDiscount]);

  // Run calculation when the watched fields change
  useEffect(() => {
    calculateTotalCharges();
  }, [calculateTotalCharges]);

  return (
    <div className="rounded-sm border border-stroke bg-white px-2 pb-2.5 pt-2 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-3.5 xl:pb-1">
      <div className="flex justify-end">
        {isEditable && (
          <button
            type="button"
            onClick={() => replace([])}
            className="hover:text-bule-400 mb-1 flex transform-gpu font-medium text-primary transition-all duration-300 hover:text-blue-400 active:scale-95 disabled:bg-slate-500"
            disabled={!isEditable}
          >
            Reset
          </button>
        )}
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="w-[20px] px-1 py-4 font-medium text-black dark:text-white xl:pl-4">
                S.NO.
              </th>
              <th className="w-[220px] px-2 py-4 font-medium text-black dark:text-white xl:pl-4">
                Parameter / Activity
              </th>
              <th className="w-[150px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                SAC
              </th>
              <th className="w-[150px] px-2 py-4 font-medium text-black dark:text-white xl:pl-4">
                Testing Charge ({currency})
              </th>
              <th className="w-[150px] px-2 py-4 font-medium text-black dark:text-white xl:pl-6">
                No. of Tested ({tested_type})
              </th>
              <th className="w-[150px] px-2 py-4 font-medium text-black dark:text-white xl:pl-6">
                Total Testing Charge ({currency})
              </th>
              <th className="w-[100px] px-2 py-4 font-medium text-black dark:text-white xl:pl-6">
                Remove?
              </th>
            </tr>
          </thead>
          <tbody>
            {fields.map((item, idx: number) => (
              <tr key={item.id}>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-4">
                  <h5 className="font-medium text-black dark:text-white">
                    {idx + 1}
                  </h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-4">
                  <input
                    type="hidden"
                    {...register(`${arrayFieldName}.${idx}.id`)}
                  />
                  <input
                    type="text"
                    {...register(`${arrayFieldName}.${idx}.test_parameter`)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 pl-1 pr-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    disabled={!isEditable}
                  />
                </td>
                <td className="border-b border-[#eee] px-1 py-3 pl-9 dark:border-strokedark xl:pl-11">
                  <input
                    type="text"
                    {...register(`${arrayFieldName}.${idx}.sac`)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 pl-1 pr-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    disabled={!isEditable}
                  />
                </td>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-4">
                  <input
                    type="number"
                    {...register(`${arrayFieldName}.${idx}.testing_charge`)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 pl-1 pr-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    onKeyDown={(e) => {
                      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                        e.preventDefault();
                      }
                    }}
                    onWheel={(e) => e.preventDefault()}
                    disabled={!isEditable}
                  />
                </td>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-6">
                  <input
                    type="number"
                    {...register(`${arrayFieldName}.${idx}.no_of_tested`)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 pl-1 pr-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    onKeyDown={(e) => {
                      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                        e.preventDefault();
                      }
                    }}
                    onWheel={(e) => e.preventDefault()}
                    disabled={!isEditable}
                  />
                </td>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-6">
                  {/* <input
                    type="number"
                    readOnly
                    {...register(
                      `${arrayFieldName}.${idx}.total_testing_charge`,
                    )}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-2 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  /> */}
                  {totals[idx]}
                </td>
                <td className="border-b border-[#eee] px-2 py-5 pl-6 dark:border-strokedark xl:pl-6">
                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    disabled={!isEditable}
                  >
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td
                colSpan={5}
                className="px-4 py-5 text-right font-medium text-black dark:text-white"
              >
                Sub Total:
              </td>
              <td className="border-b border-[#eee] px-4 py-5 text-right font-medium text-black dark:text-white">
                {/* Subtotal value */}
                {subtotal}
              </td>
            </tr>

            <tr>
              <td
                colSpan={5}
                className="px-4 py-5 text-right font-medium text-black dark:text-white"
              >
                Discount:
              </td>
              <td className="border-b border-[#eee] px-4 py-5 text-right font-medium text-black dark:text-white">
                <input
                  type="number"
                  {...register(`discount`)}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-2 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  disabled={!isEditable}
                />
              </td>
            </tr>
            {invoiceType === "TAMILNADU_CUSTOMER" && (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-5 text-right font-medium text-black dark:text-white"
              >
                CGST ({9}%):
              </td>
              <td className="border-b border-[#eee] px-4 py-5 text-right font-medium text-black dark:text-white">
                {/* CGST value */}
                {cgst}
              </td>
            </tr>
            )}
            {invoiceType === "TAMILNADU_CUSTOMER" && (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-5 text-right font-medium text-black dark:text-white"
              >
                SGST ({9}%):
              </td>
              <td className="border-b border-[#eee] px-4 py-5 text-right font-medium text-black dark:text-white">
                {/* SGST value */}
                {sgst}
              </td>
            </tr>
            )}
            {invoiceType === "PROFORMA_TAMILNADU_CUSTOMER" && (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-5 text-right font-medium text-black dark:text-white"
              >
                CGST ({9}%):
              </td>
              <td className="border-b border-[#eee] px-4 py-5 text-right font-medium text-black dark:text-white">
                {/* CGST value */}
                {cgst}
              </td>
            </tr>
            )}
            {invoiceType === "PROFORMA_TAMILNADU_CUSTOMER" && (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-5 text-right font-medium text-black dark:text-white"
              >
                SGST ({9}%):
              </td>
              <td className="border-b border-[#eee] px-4 py-5 text-right font-medium text-black dark:text-white">
                {/* SGST value */}
                {sgst}
              </td>
            </tr>
            )}
            {(invoiceType === "OTHER_STATE_CUSTOMER" || invoiceType === "PROFORMA_OTHER_STATE_CUSTOMER") && (  
               <tr>
               <td
                 colSpan={5}
                 className="px-4 py-5 text-right font-medium text-black dark:text-white"
               >
                 IGST ({18}%):
               </td>
               <td className="border-b border-[#eee] px-4 py-5 text-right font-medium text-black dark:text-white">
                  {/* IGST value */}
                  {igst}
               </td>
             </tr>  
            )}
            <tr>
              <td
                colSpan={5}
                className="px-4 py-5 text-right font-bold text-black dark:text-white"
              >
                Grand Total:
              </td>
              <td className="border-b border-[#eee] px-4 py-5 text-right font-bold text-black dark:text-white">
                {/* Grand total value */}
                {grandTotal}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex gap-4">
          {isEditable && (
            <button
              type="button"
              className="mt-2 flex w-1/5 transform-gpu items-center justify-center rounded border-2 border-primary p-3 font-medium text-black transition-all duration-300 hover:bg-primary hover:text-white active:scale-95 disabled:bg-slate-500"
              onClick={() =>
                append({
                  id: "",
                  test_parameter: undefined,
                  sac: undefined,
                  testing_charge: undefined,
                  no_of_tested: undefined,
                })
              }
            >
              Add Parameter
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
