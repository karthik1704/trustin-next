import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { updateParameter } from "../actions";
import { SERVER_API_URL } from "@/app/constant";
import ParameterEditForm from "./parameter-edit-form";
export const metadata: Metadata = {
  title: "Edit Test Parameter | Trustin",
  description: "This is Form Layout page for TailAdmin Next.js",
  // other metadata
};
async function getData(id: string) {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");

  // const res = await fetch(`${SERVER_API_URL}/branch/`, {
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${access_token?.value}`,
  //   },
  // });
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
  const res4 = await fetch(`${SERVER_API_URL}/parameters/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
  });
  // const res5 = await fetch(`${SERVER_API_URL}/customers/all/`, {
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${access_token?.value}`,
  //   },
  // });
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res2.ok || !res3.ok || !res4.ok) {
    // This will activate the closest `error.js` Error Boundary
    // console.log(res)
    // throw new Error("Failed to fetch data");
    console.log("error");
    redirect("/signin");
  }

  // const branch = await res.json();
  const products = await res2.json();
  const test_types = await res3.json();
  const parameter = await res4.json();
  // const customers = await res5.json();
  return {
    // branch,
    products,
    test_types,
    parameter,
    // customers,
  };
}

export type Data = {
  branch?: {
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
  customers?: {
    id: number;
    company_name: string;
  }[];
  parameter: {
    branch_id: number;
    test_type_id: number;
    product_id: number;
    customer_id: number;

    testing_parameters: string;
    amount: number;
    method_or_spec: string;
    specification_limits: string | null | undefined;
    min_limits: string | null | undefined;
    max_limits: string | null | undefined;

    group_of_test_parameters: string;
  };
};

const EditTestParameterPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const data: Data = await getData(id);
  const updateParameterWithId = updateParameter.bind(null, id);
  return (
    <>
      <Breadcrumb pageName="Edit  Test Parameter" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            {/* <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Contact Form
              </h3>
            </div> */}
            <ParameterEditForm data={data} actionFn={updateParameterWithId} />
          </div>
        </div>
      </div>
    </>
  );
};

export default EditTestParameterPage;
