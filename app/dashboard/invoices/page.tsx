import Link from "next/link";
import { cookies } from "next/headers";
import InvoiceTable from "./invoices-table";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { SERVER_API_URL } from "@/app/constant";
import axios from "axios";
import Search from "@/components/search-box";
import Pagination from "@/components/pagination";

export const metadata: Metadata = {
  title: "Invoices | Trustin",
  description: "This is Invoices page ",
  // other metadata
};

async function getData(
  params: { [key: string]: string | string[] | undefined } | undefined,
) {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");
  console.log(access_token);

  const page = parseInt((params?.page as string) || "1");
  const size = parseInt((params?.size as string) || "10");
  const search = params?.search || "";
  const sortBy = params?.sort_by || "id";
  const sortOrder = params?.sort_order || "desc";

  const response = await axios.get(`${SERVER_API_URL}/invoices/`, {
    params: {
      page,
      size,
      search,
      sort_by: sortBy,
      sort_order: sortOrder,
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
  });

  if (response.status === 401) redirect("/login");
  if (response.status !== 200) {
    console.log("hi", response);
    throw new Error("Failed to fetch data");
  }
  console.log(response.data)
  return response.data;
}

export type Invoices = {
  id: number;
  invoice_mode: "INVOICE" | "PERFORMA_INVOICE";
  invoice_code: string;
  invoice_type: string;
  customer_id: number;
  customer_address: string;
  customer_email: string;
  customer_gst: string;
  customer_ref_no: string;
  quotation_ref_no: string;
  sample_id_nos: string;
  sub_total: string;
  grand_total: string;
  discount: string;
  sgst: string;
  cgst: string;
  currency: string;
  tested_type:  "BATCHES" | "TESTED" | "PIECES" | "LOCATION";
  customer: {
    company_name: string;
  }
}[];

export type Data = {
  data: Invoices;
  total: number;
  page: number;
};

const InvoicesPage = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const data = await getData(searchParams);
  
  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Invoices
        </h2>
        <Link
          href="invoices/new"
          className="inline-flex items-center justify-center rounded-md border border-black px-5 py-4 text-center font-medium text-black hover:bg-opacity-90 dark:border-white dark:text-white lg:px-8 xl:px-10"
        >
          New Invoice
        </Link>
      </div>
      <div className="flex flex-col gap-10">
        <Search path="/dashboard/invoices" />

        <InvoiceTable data={data} />
        <Pagination
          total={data.total}
          page={data.page}
          size={data.size}
          path="/dashboard/invoices"
        />
      </div>
    </>
  );
};

export default InvoicesPage;
