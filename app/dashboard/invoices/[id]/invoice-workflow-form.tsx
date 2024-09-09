"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { toast } from "sonner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Modal from "@/components/Modal/Modal";
import {
  PDFViewer,
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";

import { Data } from "./typings";
import { invoiceTypes } from '../constants';
import CombineWorkflow from "./combine-workflow";
import EmailPopup from "./email-popup";
import InvoiceEditForm from "./invoice-edit-form";

import { current } from "tailwindcss/colors";
import ExemptedInvoice from "@/components/Print/invoice/exempted-invoice";
import TamilNaduInvoice from "@/components/Print/invoice/tamilnadu-invoice";
import USDInvoice from "@/components/Print/invoice/usd-invoice";
import OtherStateInvoice from "@/components/Print/invoice/other-state-invoice";

const InvoiceComponent = ({ type, invoiceData }: { type: string; invoiceData: Data }) => {
  switch (type) {
    
    case "USD":
      return <USDInvoice invoiceData={invoiceData} />;
    case "EXEMPTED_CUSTOMER":
      return <ExemptedInvoice invoiceData={invoiceData} />;
    case "TAMILNADU_CUSTOMER":
      return <TamilNaduInvoice invoiceData={invoiceData} />;
    case "OTHER_STATE_CUSTOMER":
      return <OtherStateInvoice invoiceData={invoiceData} />;
    default:
      console.log("invoice type not found");
      return null;
  }
};

type Props = {
  qr: string;
  data: Data;

  actionFn: (
    prevState: any,
    data: FormData,
  ) => Promise<
    { fieldErrors: null; type: string; message: string | undefined } | undefined
  >;
  actionFnResult: (
    data: any,
  ) => Promise<
    { fieldErrors: null; type: string; message: string | undefined } | undefined
  >;

  actionUpdateInvoice: (
    data: any,
  ) => Promise<
    { fieldErrors: null; type: string; message: string | undefined } | undefined
  >;
};

type Workflow = {
  id: number;
  invoice_status_id: number;
  assigned_to: number | null;
  status: string;
  assignee: { first_name: string; last_name: string } | null;
  department: { id: number; name: string } | null;
  role: { id: number; name: string } | null;
  updated_at: string;
}[];

type History = {
  id: number;
  from_status_id: number;
  to_status_id: number;
  assigned_to: number | null;
  comments: string | null;
  created_at: string;
  created_by: number;
  from_status: { id: number; name: string } | null;
  to_status: { id: number; name: string } | null;
  assignee: { first_name: string; last_name: string } | null;
  created_by_user: { first_name: string; last_name: string } | null;
}[];

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

const status = [
  "Registered",
  "Approve",
  "Draft report/ Report released",
  "Done",
];

const InvoiceWorkflowForm = ({
  data,
  actionFn,
  actionFnResult,
  actionUpdateInvoice,
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
      router.push("/dashboard/invoices");
    }
  }, [state, router]);

  const {invoice_type} = data.invoice;

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        
        <PDFViewer
          width="1000"
          height="600"
          // showToolbar={data.sample.status_id > 7 ? true : false}
        >
          <InvoiceComponent type={invoice_type} invoiceData={data} />
        </PDFViewer>
        {/* <PDFDownloadLink document={< MyDocument/>} fileName="somename.pdf">
      {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download now!')}
    </PDFDownloadLink> */}
      </Modal>

      <Tabs defaultValue="status" className="mt-1 w-full p-4">
        <TabsList>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          {(data?.currentUser?.department_id === 2 ||
            data?.currentUser?.department_id === 1) && (
            <TabsTrigger value="history">History</TabsTrigger>
          )}
          {/* {!!data.invoice?.emails?.length && (
            <TabsTrigger value="emails">Email Status</TabsTrigger>
          )} */}
        </TabsList>
        <TabsContent value="status">
          <div>
            <CombineWorkflow
              data={data}
              formAction={formAction}
              openModal={openModal}
              actionFn={actionFn}
              actionFnReject={actionFnResult}
              actionFnResult={actionFnResult}
              current_step={data?.invoice?.status_id ?? 1}
            />{" "}
           
              <div className="mb-3 w-full flex-col">
                <InvoiceEditForm data={data} actionFn={actionUpdateInvoice} />
              </div>
            
            <div>{/* Data comes here */}</div>
          </div>
        </TabsContent>
        <TabsContent value="workflow">
          <div className="min-h-28">
            <WorkflowTable workflow={data.invoice.invoice_workflows} />
          </div>
        </TabsContent>
        <TabsContent value="history">
          <div className="min-h-28">
            <HistoryTable history={data.invoice.invoice_history} />{" "}
          </div>
        </TabsContent>
        <TabsContent value="emails">
          <div className="min-h-28">
            {/* <EmailTable emails={data.sample.emails} /> */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvoiceWorkflowForm;

const WorkflowTable = ({ workflow }: { workflow: Workflow[] }) => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="w-[100px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Status
              </th>
              <th className="w-[150px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Updated At
              </th>
              <th className="w-[150px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Assignee
              </th>
              <th className="w-[150px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Status
              </th>
              <th className="w-[100px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Role
              </th>
              <th className="min-w-[100px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Department
              </th>
            </tr>
          </thead>
          <tbody>
            {workflow?.map((flow, idx) => (
              <tr key={flow.id}>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <p className="text-base font-medium text-black dark:text-white">
                    {status[idx]}
                  </p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <p className="text-base font-medium text-black dark:text-white">
                    {new Date(flow.updated_at).toLocaleString()}
                  </p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <p className="text-base font-medium text-black dark:text-white">
                    {flow.assignee
                      ? `${flow.assignee.first_name} ${flow.assignee.last_name}`
                      : "---"}
                  </p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <p className="text-base font-medium text-black dark:text-white">
                    {flow.status ?? "---"}
                  </p>
                </td>

                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <p className="text-base font-medium text-black dark:text-white">
                    {flow?.role?.name ?? "---"}
                  </p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <p className="text-base font-medium text-black dark:text-white">
                    {flow?.department?.name ?? "---"}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const HistoryTable = ({ history }: { history: History }) => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="w-[200px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Date
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Assignee
              </th>
              <th className="min-w-[130px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Created by
              </th>
              <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Comments
              </th>
              <th className="min-w-[100px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                From
              </th>
              <th className="min-w-[100px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                To
              </th>
            </tr>
          </thead>
          <tbody>
            {history?.map((h, idx) => (
              <tr key={h.id}>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {new Date(h.created_at).toLocaleString()}
                  </h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {h.assignee
                      ? `${h.assignee.first_name} ${h.assignee.last_name}`
                      : "No Name"}
                  </h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {h.created_by_user
                      ? `${h.created_by_user.first_name} ${h.created_by_user.last_name}`
                      : "No Name"}{" "}
                  </h5>
                </td>

                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {h?.comments ?? "---"}
                  </h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {h?.from_status?.name ?? "---"}
                  </h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {h?.to_status?.name ?? "---"}
                  </h5>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const EmailTable = ({ emails }: { emails: EmailStatus }) => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="w-[200px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Date
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Subject
              </th>
              <th className="min-w-[100px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                To
              </th>
              <th className="min-w-[130px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Sent by
              </th>
              <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Status
              </th>
              <th className="min-w-[100px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                reason
              </th>
            </tr>
          </thead>
          <tbody>
            {emails?.map((h, idx) => (
              <tr key={h.id}>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {new Date(h.timestamp).toLocaleString()}
                  </h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {h.subject}
                  </h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {h.recipient}{" "}
                  </h5>
                </td>

                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {`${h?.emailed_user.first_name} ${h?.emailed_user.last_name}`}
                  </h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {h?.sent ? "Success" : "Failed"}
                  </h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {h?.reason ?? "---"}
                  </h5>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
