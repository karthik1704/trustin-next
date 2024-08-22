"use client";
import MyDocument from "@/components/Print/ReportPDF";
import { Data } from "./page";

import dynamic from "next/dynamic";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  },
);

const ShowPDF = ({ data, qr }: { data: Data; qr: string }) => {
  return (
    <div>
      <PDFViewer className="min-h-dvh w-full" showToolbar={true}>
        <MyDocument qr={qr} data={data} isDraft={false} />
      </PDFViewer>
    </div>
  );
};

export default ShowPDF