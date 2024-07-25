"use client";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { createFrontDesk } from "../actions";
import SubmitButton from "@/components/submit-button/submit-button";
import { Customer, Data } from "./typings";
import Select from "@/components/select-input";
import UncontrolledComboBox from "@/components/combo-box/uncontrolled-combo-box";

const Customers = [
  { id: 1, name: "Muthu" },
  { id: 2, name: "Krishna" },
  { id: 2, name: "Karthi" },
  { id: 2, name: "Ram" },
];

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

const FrontDeskEditForm = ({
  data,
  actionFn,
}: {
  data: Data;
  actionFn: (
    prevState: any,
    formData: FormData,
  ) => Promise<
    { fieldErrors: null; type: string; message: string | undefined } | undefined
  >;
}) => {
  const [state, formAction] = useFormState(actionFn, initialState);
  const router = useRouter();
  const readOnly = data.user?.role_id === 1 ? false : true;
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
      router.push("/dashboard/front-desk");
    }
  }, [state, router]);

  return (
    <form action={formAction}>
      <div className="p-6.5">
        {/* <div className="mb-4.5">
          <Select
            label="Customer"
            name="customer_id"
            defaultValue={data.frontDesk.customer_id}
             disabled={readOnly}
          >
            {data.customers.map((customer) => (
              <option value={customer.id} key={customer.id}>
                {customer.company_name}
              </option>
            ))}
          </Select>
        </div> */}
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
              value={data.frontDesk.customer_id}
            />
          </div>
        </div>

        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Mode of Received
          </label>
          <input
            type="text"
            readOnly={readOnly}
            name="courier_name"
            placeholder="Mode of Received"
            defaultValue={data.frontDesk.courier_name}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>

        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Date Received
          </label>
          <input
            readOnly={readOnly}
            type="datetime-local"
            name="date_of_received"
            placeholder="Date Received"
            defaultValue={new Date(data.frontDesk.date_of_received)
              .toISOString()
              .slice(0, 16)}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>
        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Storage Condition
          </label>
          <input
            readOnly={readOnly}
            type="text"
            name="temperature"
            placeholder="Storage Condition"
            defaultValue={data.frontDesk.temperature}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>

        <div className="mb-4.5">
          <Select
            label="Received Condition"
            name="received_condition"
            defaultValue={data.frontDesk.received_condition}
            disabled={readOnly}
          >
            <option value="GOOD">Good</option>
            <option value="DAMAGED">Damaged</option>
          </Select>
        </div>

        <div className="mb-4.5">
          <Select
            label="Forward to department"
            name="deparment_id"
            defaultValue={data.frontDesk.deparment_id}
            disabled={readOnly}
          >
            <option value={6}>Registration</option>
          </Select>
        </div>

        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Reason for Change
          </label>
          <textarea
            readOnly={readOnly}
            name="reason"
            defaultValue={data.frontDesk.reason}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>

        {readOnly ? (
          <div className="mb-4.5">
            <div className="w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Status
              </label>
              <input
                readOnly={true}
                name="status"
                defaultValue={data.frontDesk.status}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>
          </div>
        ) : (
          <div className="mb-4.5">
            <Select
              label="Status"
              name="status"
              defaultValue={data.frontDesk.status}
              disabled
            >
              <option value="UNDER_REGISTRATION">Under Registration</option>
              <option value="REGISTERED">Registered</option>
            </Select>
          </div>
        )}

        {!readOnly && <SubmitButton />}
      </div>
    </form>
  );
};

export default FrontDeskEditForm;
