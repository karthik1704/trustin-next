import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PDF_URL, SERVER_API_URL } from "@/app/constant";
import {
  patchInvoiceWorkflow,
  patchInvoiceWorkflowTest,
  updateInvoice,
} from "../actions";
import InvoiceWorkflowForm from "./invoice-workflow-form";
import { Data } from "./typings";
import { User } from "@/types/user";

export const metadata: Metadata = {
  title: "Invoice Workflow | Trustin",
  description: "This is Form Layout page for TailAdmin Next.js",
  // other metadata
};

async function getData(id: string) {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");

  const res = await fetch(`${SERVER_API_URL}/invoices/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
  });

  const res2 = await fetch(`${SERVER_API_URL}/customers/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
  });
  const res3 = await fetch(`${SERVER_API_URL}/users/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
  });
  const res4 = await fetch(`${SERVER_API_URL}/users/me`, {
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
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    // console.log(res)
    // throw new Error("Failed to fetch data");
    console.log("error");
  }
  if (!res2.ok) {
    // This will activate the closest `error.js` Error Boundary
    // console.log(res)
    // throw new Error("Failed to fetch data");
    console.log("error2");
  }
  if (!res3.ok) {
    // This will activate the closest `error.js` Error Boundary
    // console.log(res)
    // throw new Error("Failed to fetch data");
    console.log("error3");
  }
  if (!res4.ok) {
    // This will activate the closest `error.js` Error Boundary
    // console.log(res)
    // throw new Error("Failed to fetch data");
    console.log("error4");
  }

  const invoice = await res.json();
  // const branches = await res2.json();
  const users: User[] = await res3.json();
  const currentUser = await res4.json();

  return {
    invoice,
    // branches,
    users: users,
    currentUser,
  };
}

const EditInvoicePage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const data: Data = await getData(id);
  //   const updateProductWithId = updateProducts.bind(null, id);
  const patchInvoiceWorkflowWithId = patchInvoiceWorkflow.bind(null, id);

  const updateSampleWithId = updateInvoice.bind(null, id);
  const patchInvoiceWorkflowTestWithId = patchInvoiceWorkflowTest.bind(
    null,
    id,
  );

  return (
    <>
      <Breadcrumb pageName="Invoice WorkFlow" />

      <div className="grid grid-cols-1 items-center justify-center gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <InvoiceWorkflowForm
            data={data}
            actionFn={patchInvoiceWorkflowWithId}
            actionFnResult={patchInvoiceWorkflowTestWithId}
            actionUpdateInvoice={updateSampleWithId}
            qr={""}
          />
        </div>
      </div>
    </>
  );
};

export default EditInvoicePage;
