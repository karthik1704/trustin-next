"use client";
import MyDocument from "@/components/Print/report/ReportPDF";
import { Data } from "./page";
import { CloudDownload } from 'lucide-react';

import dynamic from "next/dynamic";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  },
);
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  },
);

const ShowPDF = ({
  data,
  qr,
  isMobile,
}: {
  data: Data;
  qr: string;
  isMobile: boolean;
}) => {
  return (
    <div>
      {!isMobile &&
      <PDFViewer className="min-h-dvh w-full" showToolbar={true}>
        <MyDocument qr={qr} data={data} isDraft={false} />
      </PDFViewer>
}{isMobile &&
<div className="w-full h-svh flex items-center justify-center ">
      <PDFDownloadLink
        document={<MyDocument qr={qr} data={data} isDraft={false} />}
        fileName={`${data.sample.sample_id}.pdf`}
        className="mt-4 flex w-49 transform-gpu justify-center rounded bg-primary p-3 font-medium text-gray transition-all duration-300 hover:bg-blue-500 active:scale-95 disabled:bg-slate-500"

      >
        {({ blob, url, loading, error }) =>(
          <>
          <CloudDownload className="mr-3"/>
         { loading ? "Loading ..." : <span>Download now!</span>}
          </>
        )

        }
      </PDFDownloadLink>
      </div>
      }
    </div>
  );
};

export default ShowPDF;
