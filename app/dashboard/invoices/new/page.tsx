import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import InvoiceAddForm from "./invoice-add-form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SERVER_API_URL } from "@/app/constant";

export const metadata: Metadata = {
  title: "Add New Invoice | Trustin",
  description: "This is Form Layout page for TailAdmin Next.js",
  // other metadata
};

async function getData() {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");
  console.log(access_token);
  const res = await fetch(`${SERVER_API_URL}/customers/all/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
    next: {
      tags: ["front-desk"],
    },
  });
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    // console.log(res)
    // throw new Error("Failed to fetch data");
    console.log("error");
  }
  if (res.status === 401) redirect("/signin");

  const customers = await res.json();
  return {
    customers,
  };
}

export type Data = {
  customers: {
    id: number;
    company_name: string;
    customer_code: string;
    email:string;
    full_address:string;
    gst:string;
  }[];
};

const NewFrontDesk = async () => {
  const data: Data = await getData();
  return (
    <>
      <Breadcrumb pageName="Add New Invoice" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            {/* <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Contact Form
              </h3>
            </div> */}
            <InvoiceAddForm data={data} />
          </div>
        </div>
      </div>
    </>
  );
};

export default NewFrontDesk;
