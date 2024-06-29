import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import ParametersTable, { ParametersType } from "./parametes-table";
import { Metadata } from "next";
import { SERVER_API_URL } from "@/app/constant";

export const metadata: Metadata = {
  title: "Test Parameters | Trustin",
  description: "This is Test Parameters page ",
  // other metadata
};
async function getData() {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");
  const res = await fetch(`${SERVER_API_URL}/parameters/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
    next:{
      tags:['Parameters'],
    }
  });


  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    // console.log(res)
    // throw new Error("Failed to fetch data");
    console.log("error");
  }

  if (res.status === 401) redirect("/signin");
  const resjson = await res.json();
  console.log(resjson)
  return resjson;
}

const TestParameterPage = async () => {
  const data: ParametersType = await getData();
  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Test Parameters
        </h2>
        <Link
          href="parameters/new"
          className="inline-flex items-center justify-center rounded-md border border-black py-4 px-5 text-center font-medium text-black hover:bg-opacity-90 lg:px-8 xl:px-10 dark:text-white dark:border-white"
        >
          New Test Parameter
        </Link>
      </div>
      <div className="flex flex-col gap-4">
        <ParametersTable data={data} />
      </div>
    </>
  );
};

export default TestParameterPage;
