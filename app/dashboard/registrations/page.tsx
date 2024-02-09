import Link from "next/link";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import BranchTable, { BranchType } from "./branch-table";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Branch | Trustin",
  description: "This is Branch page ",
  // other metadata
};

async function getData() {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");

  const res = await fetch("http://localhost:8000/branch/", {
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

  if(res.status === 401) redirect('/signin');

  const branch = await res.json();

  return branch;
}


const BranchesPage = async () => {
  const data:BranchType = await getData();
  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Branches
        </h2>
        <Link
          href="branches/new"
          className="inline-flex items-center justify-center rounded-md border border-black py-4 px-5 text-center font-medium text-black hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          New Branch
        </Link>
      </div>
      <div className="flex flex-col gap-10">
        <BranchTable data={data} />
      </div>
    </>
  );
};

export default BranchesPage;
