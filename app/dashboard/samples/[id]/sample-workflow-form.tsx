"use client";
import { useFormState } from "react-dom";

import { Data, EmailStatus } from "./typings";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatusStepper from "./status-stepper1";
import UnderTestingForm from "./under-testing-form";
import WorkFlowForm from "@/components/WorkFlowForms/workflowform";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// import InvoicePDF from '@/components/Print/InvoicePDF';
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
import ReactDOMServer from "react-dom/server";
// import Modal from 'react-modal';
import Modal from "@/components/Modal/Modal";
import MyDocument from "@/components/Print/report/ReportPDF";
// Make sure to bind modal to your app element (https://reactcommunity.org/react-modal/accessibility/)

// import { PDFDocument, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";
import SamplesEditForm from "./samples-edit-form";
import Link from "next/link";
import ConfrimDialog from "./confrim-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CombineWorkflow from "./combine-workflow";
import { date } from "zod";
import { current } from "tailwindcss/colors";
import EmailPopup from "./email-popup";

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
  actionFnReject: (
    data: any,
  ) => Promise<
    { fieldErrors: null; type: string; message: string | undefined } | undefined
  >;
  actionUpdateSample: (
    data: any,
  ) => Promise<
    { fieldErrors: null; type: string; message: string | undefined } | undefined
  >;
};

type Workflow = {
  id: number;
  sample_status_id: number;
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
  "Under review and Sample requested (HOD)",
  "Under Registration team (Sample issue)",
  "Sample Received",
  "Under Testing",
  "Under QC Review",
  "Under QA Review",
  // "Under Report preparation",
  "Draft report/ Report released",
  "Done",
];

// Create a function to generate the PDF content
const generatePDFContent = () => {
  // Render the PDF content to a string
  const pdfContent = ReactDOMServer.renderToString(
    <Document>
      <Page>
        <View>
          <Text>Hello, World!</Text>
        </View>
      </Page>
    </Document>,
  );

  return pdfContent;
};

// Create a function to generate the PDF and open it in a new window
const generateAndDisplayPDF = () => {
  // Generate the PDF content
  const pdfContent = generatePDFContent();
  // const pdfContent = ReactDOMServer.renderToString(
  //   InvoicePDF()
  // )

  console.log(pdfContent);

  // Convert the PDF content string to a blob
  const blob = new Blob([pdfContent], { type: "application/pdf" });

  // Create blob URL
  const pdfBlobUrl = URL.createObjectURL(blob);

  // Open a new window and display the PDF
  const newWindow = window.open(pdfBlobUrl, "_blank");
  if (newWindow) {
    newWindow.focus();
  } else {
    alert("Please allow pop-ups for this site");
  }
};

const SampleWorkflowForm = ({
  data,
  actionFn,
  actionFnResult,
  actionFnReject,
  actionUpdateSample,
  qr,
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportType, setReportType] = useState("Original");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleReportType = (type: string) => {
    setReportType(type);
    openModal();
  };

  const handlePrintButtonClick = () => {
    generateAndDisplayPDF();
  };
  // const handlePrint = () => {
  //   // Open a new tab
  //   const newWindow = window.open('', '_blank');
  //   if (newWindow) {
  //     // Render the PDF preview component in the new tab
  //     newWindow.document.body.innerHTML = '<div id="pdf-preview"></div>';
  //     ReactDOM.render(<PDFPreview />, newWindow.document.getElementById('pdf-preview'));
  //   } else {
  //     alert('Popup blocked! Please allow popups for this website.');
  //   }
  // };
  // const handlePrint = () => {

  //   const root = createRoot(document.getElementById('root'));
  //   // Render the PDF component into the new window
  //   // root.render(<React.StrictMode><InvoicePDF /></React.StrictMode>, newWindow?.document.getElementById('invoice'));
  //   root.render(
  //     <PDFViewer style={{ width: '100%', height: '100vh' }}>
  //       <InvoicePDF />
  //     </PDFViewer>
  //   );
  //    // Convert PDF to blob URL
  //    const pdfBlobUrl = root.toBlobUrl();
  //   const newWindow = window.open(pdfBlobUrl, '_blank');
  //   newWindow?.document.write('<html><head><title>Print</title></head><body>');
  //   newWindow?.document.write('<div id="invoice"></div>');
  //   newWindow?.document.write('</body></html>');
  //   newWindow?.document.close();

  //   // Open a new window and display the PDF
  //   // const newWindow = window.open(pdfBlobUrl, '_blank');
  //   if (newWindow) {
  //     newWindow.focus();
  //   } else {
  //     alert('Please allow pop-ups for this site');
  //   }
  // };

  const [state, formAction] = useFormState(actionFn, initialState);
  const router = useRouter();
  const sampleTypes = data.sample.sample_test_types.map(
    (type) => type.test_type_id,
  );

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
      router.push("/dashboard/samples");
    }
  }, [state, router]);

  console.log(data.sample);

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      {/* <div className="align-items:flex-end flex flex-col items-end gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={openModal}
          className="align-items: flex-end m-1 justify-center rounded bg-primary p-2 font-medium text-gray"
        >
          Print
        </button>
      </div> */}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {/* <h2>This is a modal</h2>
        <p>Modal content goes here...</p> */}
        <PDFViewer
          width="1000"
          height="600"
          showToolbar={data.sample.status_id > 7 ? true : false}
        >
          <MyDocument
            qr={qr}
            data={data}
            isDraft={data.sample.status_id === 8 ? true : false}
            reportType={reportType}
          />
        </PDFViewer>
        {/* <PDFDownloadLink document={< MyDocument/>} fileName="somename.pdf">
      {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download now!')}
    </PDFDownloadLink> */}
      </Modal>

      <Tabs defaultValue="status" className="mt-1 w-full p-4">
        <TabsList>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          {(data.currentUser.department_id === 2 ||
            data.currentUser.department_id === 1) && (
            <TabsTrigger value="history">History</TabsTrigger>
          )}
          {!!data.sample.emails.length && (
            <TabsTrigger value="emails">Email Status</TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="status">
          {/* {data?.sample?.status_id === 1 && ( */}
          {/* <div className="mb-3 w-full flex-col">
            <SamplesEditForm data={data} actionFn={actionUpdateSample} />
          </div> */}
          {/* )} */}
          {data?.sample?.registration_id && (
            <div>
              <Accordion
                type="multiple"
                defaultValue={["mech", "micro"]}
                className="mb-4"
              >
                {(data.sample.sample_test_types.length === 2 ||
                  data.sample.sample_test_types[0].test_type_id === 1) &&
                  ([1, 2, 3].includes(data.currentUser.department_id) ||
                    data.currentUser.qa_type_id === 1) && (
                    <AccordionItem value="micro">
                      <AccordionTrigger className="px-6 font-extrabold">
                        Micro Status
                      </AccordionTrigger>
                      <AccordionContent>
                        <CombineWorkflow
                          data={data}
                          formData={data.sample.sample_detail.find(
                            (detail) => detail.test_type_id === 1,
                          )}
                          test_type_id={1}
                          test_params={data.sample_micro_params}
                          formAction={formAction}
                          openModal={handleReportType}
                          actionFn={actionFn}
                          actionFnReject={actionFnReject}
                          actionFnResult={actionFnResult}
                          sample_history={data.sample_micro_history}
                          current_step={
                            data.sample_micro_history.length
                              ? data.sample_micro_history[0].to_status_id
                              : 1
                          }
                          signUsers={data.microUsers}
                          qr={qr}
                        />{" "}
                      </AccordionContent>
                    </AccordionItem>
                  )}
                {(data.sample.sample_test_types.length === 2 ||
                  data.sample.sample_test_types[0].test_type_id === 2) &&
                  ([1, 2, 3].includes(data.currentUser.department_id) ||
                    data.currentUser.qa_type_id === 2) && (
                    <AccordionItem value="mech">
                      <AccordionTrigger className="px-6 font-extrabold">
                        Mech Status
                      </AccordionTrigger>
                      <AccordionContent>
                        <CombineWorkflow
                          data={data}
                          test_type_id={2}
                          formData={data.sample.sample_detail.find(
                            (detail) => detail.test_type_id === 2,
                          )}
                          test_params={data.sample_mech_params}
                          formAction={formAction}
                          openModal={handleReportType}
                          actionFn={actionFn}
                          actionFnReject={actionFnReject}
                          actionFnResult={actionFnResult}
                          sample_history={data.sample_mech_history}
                          current_step={
                            data.sample_mech_history.length
                              ? data.sample_mech_history[0].to_status_id
                              : 1
                          }
                          signUsers={data.mechUsers}
                          qr={qr}
                        />{" "}
                      </AccordionContent>
                    </AccordionItem>
                  )}
              </Accordion>

              {(data.sample.status_id === 1 ||
                data.sample_micro_history[0]?.to_status_id === 1 ||
                data.sample_mech_history[0]?.to_status_id === 1) &&
                (data.currentUser.department_id === 3 ||
                  data.currentUser.department_id === 1) && (
                  <div className="mb-3 w-full flex-col">
                    <SamplesEditForm
                      data={data}
                      actionFn={actionUpdateSample}
                    />
                  </div>
                )}

              {/* <div className="mb-4.5 ml-2 flex flex-col gap-6 p-2 xl:flex-row">
                <table className="table-auto flex flex-col">
                  <thead className="flex flex-col">
                    <tr>
                      <th>Song</th>
                      <th>Artist</th>
                      <th>Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
                      <td>Malcolm Lockyer</td>
                      <td>1961</td>
                    </tr>
                    <tr>
                      <td>Witchy Woman</td>
                      <td>The Eagles</td>
                      <td>1972</td>
                    </tr>
                    <tr>
                      <td>Shining Star</td>
                      <td>Earth, Wind, and Fire</td>
                      <td>1975</td>
                    </tr>
                  </tbody>
                </table>

                <div className="w-full xl:w-1/5">
                  <p className="mb-2.5 block font-semibold text-black dark:text-white">
                    Sample ID:
                  </p>
                  <p>{data.sample.sample_id}</p>
                </div>
                <div className="w-full xl:w-1/5">
                  <p className="mb-2.5 block font-semibold text-black dark:text-white">
                    Sample Name:
                  </p>
                  <p>{data.sample.sample_name}</p>
                </div>

                <div className="w-full xl:w-1/5">
                  <p className="mb-2.5 block font-semibold text-black dark:text-white">
                    Registration ID:
                  </p>
                  {(data.currentUser.department_id === 6 ||
                    data.currentUser.department_id === 1) &&
                  data.sample.status_id === 1 ? (
                    <Link
                      href={`/dashboard/registrations/${data.sample?.registration?.id}`}
                      target="_blank"
                    >
                      {data.sample?.registration?.code}
                    </Link>
                  ) : (
                    <p>{data.sample?.registration?.code}</p>
                  )}
                </div>

                <div className="w-full xl:w-1/5">
                  <p className="mb-2.5 block font-semibold text-black dark:text-white">
                    Department:
                  </p>
                  <p>
                    {data.sample.sample_test_types.length === 2
                      ? "Micro and Mech"
                      : data.sample.sample_test_types[0].test_type_id === 1
                        ? "Micro"
                        : "Mech"}
                  </p>
                </div>

                <div className="w-full xl:w-1/5">
                  <p className="mb-2.5 block font-semibold text-black dark:text-white">
                    Status
                  </p>
                  <p>
                    <strong>{data.sample.status}</strong>
                  </p>
                </div>
              </div> */}

              <div className="mb-4.5 ml-2 flex flex-col gap-6 p-2 xl:flex-row">
                <div className="w-full xl:w-1/5">
                  <p className="mb-2.5 block font-semibold text-black dark:text-white">
                    Batch No:
                  </p>
                  <p>{data?.sample?.batch_or_lot_no}</p>
                </div>
                <div className="w-full xl:w-1/5">
                  <p className="mb-2.5 block font-semibold text-black dark:text-white">
                    Manufactured Date:
                  </p>
                  <p>{data.sample.manufactured_date ?? "---"}</p>
                </div>

                <div className="w-full xl:w-1/5">
                  <p className="mb-2.5 block font-semibold text-black dark:text-white">
                    Expiry Date:
                  </p>
                  <p>{data.sample.expiry_date ?? "---"} </p>
                </div>
                <div className="w-full xl:w-1/5">
                  <p className="mb-2.5 block font-semibold text-black dark:text-white">
                    Batch Size:
                  </p>
                  <p>{data.sample.batch_size}</p>
                </div>
                <div className="w-full xl:w-1/5">
                  <p className="mb-2.5 block font-semibold text-black dark:text-white">
                    Received Quantity:
                  </p>
                  <p>{data.sample.received_quantity}</p>
                </div>
              </div>

              {data.sample.sample_detail.map(
                (detail) =>
                  ([1, 2, 6].includes(data.currentUser.department_id) ||
                    data.currentUser.qa_type_id === detail.test_type_id) && (
                    <div
                      className="mb-4.5 ml-2 flex flex-col gap-6 p-2 xl:flex-row xl:flex-wrap"
                      key={detail.id}
                    >
                      <div className="w-full xl:w-1/5">
                        <p className="mb-2.5 block font-semibold text-black dark:text-white">
                          Assignee:
                        </p>
                        <p>
                          {`${detail?.assignee?.first_name} ${detail?.assignee?.last_name}`}
                        </p>
                      </div>
                      <div className="w-full xl:w-1/5">
                        <p className="mb-2.5 block font-semibold text-black dark:text-white">
                          Test Type:
                        </p>
                        <p>{detail.test_type_id === 1 ? "Micro " : "Mech"}</p>
                      </div>
                      <div className="w-full xl:w-1/5">
                        <p className="mb-2.5 block font-semibold text-black dark:text-white">
                          ULR NO.:
                        </p>
                        <p>{data.sample.ulr_no ?? "N/A"}</p>
                      </div>
                      <div className="w-full xl:w-1/5">
                        <p className="mb-2.5 block font-semibold text-black dark:text-white">
                          TAT:
                        </p>
                        <p>
                          {data.sample.tat
                            ? new Date(data.sample.tat)
                                .toISOString()
                                .split("T")[0]
                            : "---"}
                        </p>
                      </div>
                      <div className="w-full xl:w-1/5">
                        <p className="mb-2.5 block font-semibold text-black dark:text-white">
                          Testing Start Date:
                        </p>
                        <p>
                          {detail.testing_start_date
                            ? new Date(detail.testing_start_date)
                                .toISOString()
                                .split("T")[0]
                            : "---"}
                        </p>
                      </div>
                      <div className="w-full xl:w-1/5">
                        <p className="mb-2.5 block font-semibold text-black dark:text-white">
                          Testing End Date:
                        </p>
                        <p>
                          {detail.testing_end_date
                            ? new Date(detail.testing_end_date)
                                .toISOString()
                                .split("T")[0]
                            : "---"}
                        </p>
                      </div>

                      <div className="w-full xl:w-1/5">
                        <p className="mb-2.5 block font-semibold text-black dark:text-white">
                          No. of Sample Issued:
                        </p>
                        <p>{detail?.sample_issued ?? "---"}</p>
                      </div>

                      <div className="w-full xl:w-1/5">
                        <p className="mb-2.5 block font-semibold text-black dark:text-white">
                          Sample Issued To:
                        </p>
                        <p>{detail?.issued_to ?? "---"}</p>
                      </div>

                      <div className="w-full xl:w-1/5">
                        <p className="mb-2.5 block font-semibold text-black dark:text-white">
                          Authoized Sign
                        </p>
                        <p>
                          {detail.authorized_sign
                            ? `${detail?.authorized_sign.first_name} ${detail.authorized_sign.last_name}`
                            : "---"}
                        </p>
                      </div>
                    </div>
                  ),
              )}
              <div className="mb-4.5 ml-2 flex flex-col gap-6 p-2 xl:flex-row">
                <div className="w-full xl:w-1/5">
                  <p className="mb-2.5 block font-semibold text-black dark:text-white">
                    Sample Condition:
                  </p>
                  <p>{data?.sample?.sample_condition ?? "---"}</p>
                </div>

                <div className="w-full xl:w-1/5">
                  <p className="mb-2.5 block font-semibold text-black dark:text-white">
                    Sterilization Batch No.:
                  </p>
                  <p>{data?.sample?.sterilization_batch_no ?? "---"}</p>
                </div>
                <div className="w-full xl:w-1/5">
                  <p className="mb-2.5 block font-semibold text-black dark:text-white">
                    Under NABL Logo:
                  </p>
                  <p>{data?.sample?.nabl_logo ? "Yes" : "No"}</p>
                </div>

                <div className="w-full xl:w-1/5">
                  <p className="mb-2.5 block font-semibold text-black dark:text-white">
                    Under CDSCO:
                  </p>
                  <p>{data?.sample?.under_cdsco ? "Yes" : "No"}</p>
                </div>

                <div className="w-full xl:w-1/5">
                  <p className="mb-2.5 block font-semibold text-black dark:text-white">
                    Discipline:
                  </p>
                  <p>{data?.sample?.discipline}</p>
                </div>
              </div>
              <div className="w-full xl:w-1/5">
                <p className="mb-2.5 block font-semibold text-black dark:text-white">
                  Show Status in report
                </p>
                <p>{data?.sample?.show_status_report ? "Yes" : "No"}</p>
              </div>

              {/* <div className="mb-4.5 ml-2 flex flex-col gap-6 p-2 xl:flex-row">
                <div className="w-full xl:w-1/5">
                  <p className="mb-2.5 block font-semibold text-black dark:text-white">
                    No. of Sample Issued:
                  </p>
                  <p>{data?.sample?.sample_issued ?? "---"}</p>
                </div>

                <div className="w-full xl:w-1/5">
                  <p className="mb-2.5 block font-semibold text-black dark:text-white">
                    Sample Issued To:
                  </p>
                  <p>{data?.sample?.issued_to ?? "---"}</p>
                </div>
              </div> */}

              <div className="mb-4.5 ml-2 flex flex-col gap-6 p-2 xl:flex-row">
                <div className="w-full xl:w-1/5">
                  <p className="mb-2.5 block font-semibold text-black dark:text-white">
                    Sample Description
                  </p>
                  <p>{data?.sample?.description}</p>
                </div>
              </div>
              {data.currentUser.department_id !== 3 && (
                <div className="mb-4.5 ml-2 flex flex-col gap-6 p-2 xl:flex-row">
                  <div className="w-full xl:w-1/4">
                    <p className="mb-2.5 block font-semibold text-black dark:text-white">
                      Company Name:
                    </p>
                    <p>{data.sample?.registration?.company_name}</p>
                  </div>
                  {/* 
                  <div className="w-full xl:w-1/5">
                    <p className="mb-2.5 block font-semibold text-black dark:text-white">
                      Adderess Line 1:
                    </p>
                    <p>{data?.sample?.registration?.customer_address_line1}</p>
                  </div> */}
                  <div className="w-full xl:w-1/2">
                    <p className="mb-2.5 block font-semibold text-black dark:text-white">
                      Adderess:
                    </p>
                    <p>{data?.sample?.registration?.full_address}</p>
                  </div>
                  {/* <div className="w-full xl:w-1/5">
                    <p className="mb-2.5 block font-semibold text-black dark:text-white">
                      City:
                    </p>
                    <p>{data?.sample?.registration?.city}</p>
                  </div>
                  <div className="w-full xl:w-1/5">
                    <p className="mb-2.5 block font-semibold text-black dark:text-white">
                      State:
                    </p>
                    <p>{data?.sample?.registration?.state}</p>
                  </div>
                  <div className="w-full xl:w-1/5">
                    <p className="mb-2.5 block font-semibold text-black dark:text-white">
                      Pincode:
                    </p>
                    <p>{data?.sample?.registration?.pincode_no}</p>
                  </div> */}
                  <div className="w-full xl:w-1/5">
                    <p className="mb-2.5 block font-semibold text-black dark:text-white">
                      GST:
                    </p>
                    <p>{data?.sample?.registration?.gst}</p>
                  </div>
                </div>
              )}

              <div className="mb-4.5 ml-2 flex flex-col gap-6 p-2 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <p className="mb-2.5 block font-semibold text-black dark:text-white">
                    Product Name :
                  </p>
                  <p>
                    {data?.sample?.registration?.product_data?.product_name}
                  </p>
                </div>

                <div className="w-full xl:w-1/3">
                  <p className="mb-2.5 block font-semibold text-black dark:text-white">
                    Product Code:
                  </p>
                  <p>
                    {" "}
                    {data?.sample?.registration?.product_data?.product_code}
                  </p>
                </div>
              </div>

              <div className="border-b border-stroke px-2 py-4 dark:border-strokedark">
                <h3 className="font-bold text-black dark:text-white">
                  Test Parameters
                </h3>
              </div>

              {data.sample.sample_test_parameters.map((testParameter) => (
                <div
                  className="mb-4.5 ml-2 flex flex-col gap-6 p-2 xl:flex-row"
                  key={testParameter.id}
                >
                  {/* <div className="w-full xl:w-1/5">
                    <p className="mb-2.5 block font-semibold text-black dark:text-white">
                      Test Paramenter Code:
                    </p>
                    <p>{testParameter.test_parameter.parameter_code}</p>
                  </div> */}

                  <div className="w-full xl:w-1/5">
                    <p className="mb-2.5 block font-semibold text-black dark:text-white">
                      Test Paramenter Name:
                    </p>
                    <p>{testParameter.test_parameter.testing_parameters}</p>
                  </div>
                  <div className="w-full xl:w-1/5">
                    <p className="mb-2.5 block font-semibold text-black dark:text-white">
                      Test Method:
                    </p>
                    <p>{testParameter.test_parameter.method_or_spec}</p>
                  </div>
                  {data.sample.status_id >= 6 && (
                    <>
                      {" "}
                      <div className="w-full xl:w-1/5">
                        <p className="mb-2.5 block font-semibold text-black dark:text-white">
                          Value
                        </p>
                        <p>{testParameter?.value ?? ""}</p>
                      </div>
                      <div className="w-full xl:w-1/5">
                        <p className="mb-2.5 block font-semibold text-black dark:text-white">
                          Result
                        </p>
                        <p>{testParameter?.result ? "Pass" : "Fail"}</p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="workflow">
          <div className="min-h-28">
            <Accordion type="multiple">
              <AccordionItem value="item-1">
                <AccordionTrigger>Micro</AccordionTrigger>
                <AccordionContent>
                  <WorkflowTable workflow={data.sample_micro_workfolw} />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Mech</AccordionTrigger>
                <AccordionContent>
                  <WorkflowTable workflow={data.sample_mech_workfolw} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </TabsContent>
        <TabsContent value="history">
          <div className="min-h-28">
            <Accordion type="multiple">
              <AccordionItem value="item-1">
                <AccordionTrigger>Micro</AccordionTrigger>
                <AccordionContent>
                  <HistoryTable history={data.sample_micro_history} />{" "}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Mech</AccordionTrigger>
                <AccordionContent>
                  <HistoryTable history={data.sample_mech_history} />{" "}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </TabsContent>
        <TabsContent value="emails">
          <div className="min-h-28">
            <EmailTable emails={data.sample.emails} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SampleWorkflowForm;

const WorkflowTable = ({ workflow }: { workflow: Workflow }) => {
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
