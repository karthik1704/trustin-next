"use client";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { updateCustomers } from "../actions";
import SubmitButton from "@/components/submit-button/submit-button";
import { Customer } from "./typings";
import { useFieldArray, useForm } from "react-hook-form";
import { Trash2 } from "lucide-react";

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

const CustomerEditForm = ({
  data,
  actionFn,
}: {
  data: Customer;
  actionFn: (
    prevState: any,
    formData: FormData,
  ) => Promise<
    { fieldErrors: null; type: string; message: string | undefined } | undefined
  >;
}) => {
  const { register, control, handleSubmit, formState:{isLoading, isSubmitting} } = useForm({
    defaultValues: {
      pan: data.pan,
      gst: data.gst,
      company_name: data.company_name,
      email: data.email,
      full_address: data.full_address,
      // state: data.state,
      // pincode_no: data.pincode_no,
      // website: data.gst,
      // nature_of_business: data.nature_of_business,
      // customer_address_line1: data.customer_address_line1,
      // product_details: data.product_details,
      // customer_address_line2: data.customer_address_line2,
      // market: data.market,
      // city: data.city,
      // regulatory: data.regulatory,
      contact_persons: data.contact_persons.map((contact) => ({
        person_name: contact.person_name,
        mobile_number: contact.mobile_number,
        landline_number: contact.landline_number,
        contact_email: contact.contact_email,
        designation: contact.designation,
        id: contact.id,
      })),
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "contact_persons",
  });
  const [state, formAction] = useFormState(actionFn, initialState);
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
      router.push("/dashboard/customers");
    }
  }, [state, router]);

  const handleForm = (data: any) => {
    formAction(data);
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(handleForm)}>
      <div className="p-6.5">
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Company Name
          </label>
          <input
            type="text"
            {...register("company_name")}
            placeholder="Company Name"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>

        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Full Address
          </label>
          <textarea
            {...register("full_address")}
            rows={4}
            placeholder="Full Address"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>

        {/* <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Address Line 1
          </label>
          <input
            type="text"
            {...register("customer_address_line1")}
            placeholder="Floor, Street name"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>

        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Address Line 2
          </label>
          <input
            type="text"
            {...register("customer_address_line2")}
            placeholder="City , District"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>
        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <div className="w-full xl:w-1/2">
            <label className="mb-2.5 block text-black dark:text-white">
              City
            </label>
            <input
              type="text"
              {...register("city")}
              placeholder="Enter City"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <div className="w-full xl:w-1/2">
            <label className="mb-2.5 block text-black dark:text-white">
              State
            </label>
            <input
              type="text"
              {...register("state")}
              placeholder="Enter State"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
        </div>
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Pincode
          </label>
          <input
            type="text"
            {...register("pincode_no")}
            placeholder="Enter Pincode"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div> */}

        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Email <span className="text-meta-1">*</span>
          </label>
          <input
            type="email"
            {...register("email")}
            placeholder="Enter your email address"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>

        {/* <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Website
          </label>
          <input
            type="text"
            {...register("website")}
            placeholder="Enter website"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>

        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Nature of business
          </label>
          <input
            type="text"
            {...register("nature_of_business")}
            placeholder="Enter Nature of business"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Product Details
          </label>
          <input
            type="text"
            {...register("product_details")}
            placeholder="Enter Product Detail"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>

        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Market
          </label>
          <input
            type="text"
            {...register("market")}
            placeholder="Enter Market"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Regulatory
          </label>
          <input
            type="text"
            {...register("regulatory")}
            placeholder="Enter Regulatory                    "
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div> */}

        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <div className="w-full xl:w-1/2">
            <label className="mb-2.5 block text-black dark:text-white">
              Pan Number
            </label>
            <input
              type="text"
              {...register("pan")}
              placeholder="Enter Pan"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <div className="w-full xl:w-1/2">
            <label className="mb-2.5 block text-black dark:text-white">
              GST Number
            </label>
            <input
              type="text"
              {...register("gst")}
              placeholder="Enter GST"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
        </div>
        {fields.map((item, idx) => (
          <div key={item.id}>
            <div className="mb-2.5 flex justify-between border-b border-stroke px-2 py-2 dark:border-strokedark">
              <h3 className="font-semibold text-black dark:text-white">
                Contact Person #{idx + 1}
              </h3>
              <div>
                <button
                  type="button"
                  className="flex justify-center rounded-full p-2 font-medium text-black hover:bg-gray"
                  onClick={() => {
                    remove(idx);
                    // form.setValue("no_of_samples", fields.length - 1);
                  }}
                >
                  <Trash2 className="w-4" />
                </button>
              </div>
            </div>
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  Person Name
                </label>
                <input
                  type="hidden"
                  {...register(`contact_persons.${idx}.id`)}
                />
                <input
                  type="text"
                  {...register(`contact_persons.${idx}.person_name`)}
                  placeholder="Enter Name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  Designation
                </label>
                <input
                  type="text"
                  {...register(`contact_persons.${idx}.designation`)}
                  placeholder="Enter Designation"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
            </div>
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  Mobie Number
                </label>
                <input
                  type="text"
                  {...register(`contact_persons.${idx}.mobile_number`)}
                  placeholder="Enter Mobile Number"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  Landline Number
                </label>
                <input
                  type="text"
                  {...register(`contact_persons.${idx}.landline_number`)}
                  placeholder="Enter Landline Number"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
            </div>
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Email
              </label>
              <input
                type="text"
                {...register(`contact_persons.${idx}.contact_email`)}
                placeholder="Enter Email"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
          </div>
        ))}

        <div className="mb-12 flex gap-4">
          <button
            type="button"
            className="mt-2 flex w-1/5 transform-gpu items-center justify-center rounded border-2 border-primary p-3 font-medium text-black transition-all duration-300 hover:bg-primary hover:text-white active:scale-95 disabled:bg-slate-500"
            onClick={() =>
              append({
                person_name: "",
                mobile_number: "",
                landline_number: "",
                contact_email: "",
                designation: "",
                id: null as any,
              })
            }
          >
            Add Contact
          </button>
        </div>

        {/* <SubmitButton /> */}
        <button
            type="submit"
            className="mt-4 flex w-full transform-gpu justify-center rounded bg-primary p-3 font-medium text-gray transition-all duration-300 hover:bg-blue-500 active:scale-95 disabled:bg-slate-500"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? "Loading..." : "Submit"}
          </button>
      </div>
    </form>
  );
};

export default CustomerEditForm;
