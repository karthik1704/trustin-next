"use client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createInvoice } from "../actions";
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
import { Data } from "./page";
import Select from "@/components/select-input";
import { Trash2 } from "lucide-react";
import { invoiceTypes, performaInvoiceTypes } from "../constants";

type props = {
  data: Data;
};
type InitialState = {
  fieldErrors?: {} | null;
  type?: string | null;
  message?: any | string | null;
};
type FormValues = {
  customer_id: string;
  customer_address: string;
  customer_email: string;
  contact_person_name: string;
  contact_phone: string;
  customer_gst: string;
  customer_ref_no: string;
  invoice_mode: string;
  quotation_ref_no: string;
  sample_id_nos: string;
  parameters: {
    parameter: string;
    sac: string;
    testing_charge: number;
    no_of_tested: number;
    total_testing_charge: number;
  }[];
  discount: number;
  invoice_type: string;
  tested_type: string;
  currency: string;
};

const initialState: InitialState = {
  fieldErrors: {},
  type: null,
  message: null,
};

const InvoiceAddForm = ({ data }: props) => {
  const form = useForm<FormValues>({
    defaultValues: {
      discount: 0,
      invoice_type: "INR",
      tested_type: "BATCHES",
      currency: "INR",
      parameters: [],
    },
  });

  const watchCompanyFieldValue = useWatch({
    control: form.control,
    name: "customer_id",
  });

  const watchTestedType = useWatch({
    control: form.control,
    name: "tested_type",
    defaultValue: "BATCHES",
  });

  const watchCurrency = useWatch({
    control: form.control,
    name: "currency",
    defaultValue: "INR",
  });
  const watchInvoiceType = useWatch({
    control: form.control,
    name: "invoice_type",
  });
  const watchInvoice = useWatch({
    control: form.control,
    name: "invoice_mode",
  });

  const [state, setState] = useState<InitialState | undefined>(initialState);
  const router = useRouter();

  useEffect(() => {
    if (!watchCompanyFieldValue) return;
    console.log(watchCompanyFieldValue);
    const customer = data.customers.find(
      (customer) =>
        customer.id.toString() === watchCompanyFieldValue.toString(),
    );

    form.setValue("customer_address", customer?.full_address ?? "");
    form.setValue("customer_email", customer?.email ?? "");
    // form.setValue("contact_person_name", customer?.contact_person_name ?? "");
    // form.setValue("contact_phone", customer?.contact_phone ?? "");
    form.setValue("customer_gst", customer?.gst ?? "");
  }, [data.customers, form, watchCompanyFieldValue]);

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
    const res = await createInvoice(data);
    console.log(res);
    setState(res);
  };

  return (
    <UiForm {...form}>
      <form onSubmit={form.handleSubmit(handleForm)}>
        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <Select
            name="invoice_mode"
            label="Invoice"
            register={form.register}
            width={"w-full"}
          >
            <option value="INVOICE">Invoice</option>
            <option value="PERFORMA_INVOICE">Performa Invoice</option>
          </Select>
        </div>

        <div className="p-6.5">
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Customer
              </label>
              <Controller
                name={`customer_id`}
                control={form.control}
                render={({ field: { onChange, value, onBlur } }) => (
                  <ComboBox2
                    name={`customer_id`}
                    data={data.customers.map((t) => ({
                      name: ` ${t.customer_code} - ${t.company_name}`,
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
              />
            </div>
          </div>

          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <Select
              name="invoice_type"
              label="Invoice Type"
              register={form.register}
              width={"w-full xl:w-1/2"}
            >
              {Object.entries(
                watchInvoice === "PERFORMA_INVOICE"
                  ? performaInvoiceTypes
                  : invoiceTypes,
              ).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </Select>

            <Select
              name="currency"
              label="Currency Type"
              register={form.register}
              width={"w-full xl:w-1/2"}
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
            >
              <option value="TESTED">Tested</option>
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
            invoiceType={watchInvoiceType}
            invoiceMode={watchInvoice}
            form={form}
          />

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

export default InvoiceAddForm;

const TestParamsForm = ({
  control,
  register,
  arrayFieldName,
  tested_type,
  currency,
  form,
  invoiceType,
  invoiceMode,
}: {
  control: any;
  register: any;
  arrayFieldName: string;
  tested_type: string;
  currency: string;
  invoiceType: string;
  invoiceMode:string,
  form: any;
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
   
    if (invoiceMode === "PERFORMA_INVOICE"){
      if (invoiceType === "PERFORMA_TAMILNADU_CUSTOMER") {
        sgstAmount = parseFloat((newSubtotal * 0.18).toFixed(2));
        cgstAmount = parseFloat((newSubtotal * 0.18).toFixed(2));
      } else if (invoiceType === "PERFORMA_OTHER_STATE_CUSTOMER") {
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
                    type="text"
                    {...register(`${arrayFieldName}.${idx}.test_parameter`)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 pl-1 pr-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </td>
                <td className="border-b border-[#eee] px-1 py-3 pl-9 dark:border-strokedark xl:pl-11">
                  <input
                    type="text"
                    {...register(`${arrayFieldName}.${idx}.sac`)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 pl-1 pr-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
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
                  <button type="button" onClick={() => remove(idx)}>
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
                />
              </td>
            </tr>

            {invoiceType === "TAMILNADU_CUSTOMER" && (
              <>
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
              </>
            )}
            {invoiceType === "OTHER_STATE_CUSTOMER" && (
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
          <button
            type="button"
            className="mt-2 flex w-1/5 transform-gpu items-center justify-center rounded border-2 border-primary p-3 font-medium text-black transition-all duration-300 hover:bg-primary hover:text-white active:scale-95 disabled:bg-slate-500"
            onClick={() =>
              append({
                test_parameter: undefined,
                sac: undefined,
                testing_charge: undefined,
                no_of_tested: undefined,
              })
            }
          >
            Add Parameter
          </button>
        </div>
      </div>
    </div>
  );
};
