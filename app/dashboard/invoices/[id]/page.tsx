import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { updateInvoice } from "../actions";
import { SERVER_API_URL } from "@/app/constant";
import InvoiceEditForm from "./invoice-edit-form";
import { Customer, Data } from "./typings";

export const metadata: Metadata = {
  title: "Edit  Quotation | Trustin",
  description: "This is Form Layout page for TailAdmin Next.js",
  // other metadata
};

async function getData(id: string) {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");
  console.log(access_token);
  const res = await fetch(`${SERVER_API_URL}/customers/all/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
  });
  const res1 = await fetch(`${SERVER_API_URL}/invoices/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
  });


  const res3 = await fetch(`${SERVER_API_URL}/users/me`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
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

  if (!res1.ok) {
    console.log("error");
  }
  if (!res3.ok) {
    console.log("error");
  }

  const customers = await res.json();
  const invoices = await res1.json();
  const user = await res3.json();

  return { customers, invoices,  user };
}

const QuotationsEditPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const data: Data = await getData(id);
  const updateWithId = updateInvoice.bind(null, id);
  return (
    <>
      <Breadcrumb pageName="Edit Invoice" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            {/* <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Contact Form
              </h3>
            </div> */}
            <InvoiceEditForm data={data} actionFn={updateWithId} />
          </div>
        </div>
      </div>
    </>
  );
};

export default QuotationsEditPage;
