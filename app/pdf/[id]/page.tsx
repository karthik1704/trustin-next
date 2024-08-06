import { Metadata } from "next";
import { PDF_URL, SERVER_API_URL } from "@/app/constant";

import { Sample } from "@/app/dashboard/samples/[id]/typings";
import { User } from "@/types/user";
import QRCode from "qrcode";
import ShowPDF from "./show-pdf";

export const metadata: Metadata = {
  title: "Download PDF | Trustin",
  description: "This is Form Layout page for TailAdmin Next.js",
  // other metadata
};

async function getData(id: string) {
  const res = await fetch(`${SERVER_API_URL}/pdf/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    // console.log(res)
    // throw new Error("Failed to fetch data");
    console.log("error");
  }

  const sample: Sample = await res.json();

  return { sample };
}

const generateQRCode = async (text: string) => {
  try {
    const url = await QRCode.toDataURL(text);
    return url;
  } catch (err) {
    console.error(err);
  }
};

export type Data = {
    sample:Sample
}

const CustomerPDFPrint = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const data = await getData(id);
  const qrcode = await generateQRCode(`${PDF_URL}/pdf/${id}`)

  return <div 
  className="w-full h-full"
  >
    <ShowPDF data={data} qr={qrcode as string}/>
  </div>;
};

export default CustomerPDFPrint;
