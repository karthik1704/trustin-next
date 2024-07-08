import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { SERVER_API_URL } from "@/app/constant";
import FollowupAddForm from "./followup-add-form";

export const metadata: Metadata = {
  title: "Add New Customer Followup  | Trustin",
  description: "This is Form Layout page for TailAdmin Next.js",
  // other metadata
};

async function getData() {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");

  const res = await fetch(`${SERVER_API_URL}/customers/all/`, {
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
  const res3 = await fetch(`${SERVER_API_URL}/users/`, {
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

  const customers = await res.json();
  const products = await res2.json();
  const marketing_users = await res3.json();
  return {
    customers,
    products,
    marketing_users,
  };
}

export type Data = {
  customers: {
    id: number;
    company_name: string;
  }[];
  products: {
    id: number;
    product_name: string;
  }[];
  marketing_users: {
    id: number;
    first_name: string;
    last_name: string;
  }[];
};

const NewCustomerFollowupPage = async () => {
  const data: Data = await getData();
  return (
    <>
      <Breadcrumb pageName="Add New Customer Followup " />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            {/* <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Contact Form
              </h3>
            </div> */}
        <FollowupAddForm data={data}/>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewCustomerFollowupPage;
