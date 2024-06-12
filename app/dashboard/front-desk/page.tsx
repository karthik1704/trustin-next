import Link from "next/link";
import { cookies } from "next/headers";
import FrontDeskTable from "./front-desk";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { SERVER_API_URL } from "@/app/constant";

export const metadata: Metadata = {
  title: "Front Desk | Trustin",
  description: "This is Front Desk page ",
  // other metadata
};

async function getData() {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");
  console.log(access_token);
  const res = await fetch(`${SERVER_API_URL}/front-desks/`, {
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
    throw new Error("Failed to fetch data");
    console.log("error");
  }
  if (res.status === 401) redirect("/signin");
  const resjson = await res.json();
  // resjson.forEach( items => {
  //   console.log()
  // });
  console.log(resjson)
  return resjson;
}

export type Data = {
    customer_id: number;
    courier_name: string;
    date_of_received: string;
    received_condition: string;
    temperature: string;
    department_id: number;
    status: string;
    id: number;
    customer: {
      id:number;
      company_name: string;
    };
  
}[];

const FrontDeskPage = async () => {
  const data = await getData();
  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Front Desk
        </h2>
        <Link
          href="front-desk/new"
          className="inline-flex items-center justify-center rounded-md border border-black px-5 py-4 text-center font-medium text-black hover:bg-opacity-90 dark:border-white dark:text-white lg:px-8 xl:px-10"
        >
          New Front Desk
        </Link>
      </div>
      <div className="flex flex-col gap-10">
        <FrontDeskTable data={data} />
      </div>
    </>
  );
};

export default FrontDeskPage;
