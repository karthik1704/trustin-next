import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SERVER_API_URL } from "@/app/constant";
import ParameterNewForm from "./parameter-new-form";
export const metadata: Metadata = {
  title: "Add New Test Parameter | Trustin",
  description: "This is Form Layout page for TailAdmin Next.js",
  // other metadata
};

async function getData() {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");

  const res = await fetch(`${SERVER_API_URL}/branch/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
  });
  const res2 = await fetch(`${SERVER_API_URL}/products/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
  });
  const res3 = await fetch(`${SERVER_API_URL}/testtypes/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
  });
  const res4 = await fetch(`${SERVER_API_URL}/customers/all/`, {
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
    redirect("/signin");
  }

  const branch = await res.json();
  const products = await res2.json();
  const test_types = await res3.json();
  const customers = await res4.json();
  return {
    branch,
    products,
    test_types,
    customers,
  };
}

export type Data = {
  branch: {
    id: number;
    branch_name: string;
  }[];
  products: {
    id: number;
    product_name: string;
  }[];
  test_types: {
    id: number;
    name: string;
  }[];
  customers: {
    id: number;
    company_name: string;
  }[];
};

const NewTestParameterPage = async () => {
  const data: Data = await getData();
  return (
    <>
      <Breadcrumb pageName="Add New Test Parameter" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            {/* <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Contact Form
              </h3>
            </div> */}
          <ParameterNewForm data={data}/>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewTestParameterPage;
