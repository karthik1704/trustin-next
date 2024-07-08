import TableThree from "@/components/Tables/TableThree";
import Link from "next/link";
import RegistrationTable, { RegisterType } from "./registrations-table";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { SERVER_API_URL } from "@/app/constant";

import { Metadata } from "next";
import axios from "axios";
import Pagination from "@/components/pagination";
import Search from "@/components/search-box";

export const metadata: Metadata = {
  title: "Registration | Trustin",
  description: "This is Users page ",
  // other metadata
};

async function getData(
  params: { [key: string]: string | string[] | undefined } | undefined,
) {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");

  // const res = await fetch(`${SERVER_API_URL}/registrations/`, {
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${access_token?.value}`,
  //   },

  //   next:{
  //     tags:['Registration']
  //   }
  // });

  // // The return value is *not* serialized
  // // You can return Date, Map, Set, etc.

  // if (!res.ok) {
  //   // This will activate the closest `error.js` Error Boundary
  //   // console.log(res)
  //   // throw new Error("Failed to fetch data");
  //   console.log("error");
  // }

  // if (res.status === 401) redirect("/signin");

  // const {data} = await res.json();

  // return data;

  const page = parseInt((params?.page as string) || "1");
  const size = parseInt((params?.size as string) || "10");
  const search = params?.search || "";
  const sortBy = params?.sort_by || "id";
  const sortOrder = params?.sort_order || "asc";

  const response = await axios.get(`${SERVER_API_URL}/registrations/`, {
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
  return response.data;
}

const RegistrationPage = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const data: RegisterType = await getData(searchParams);
  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Registrations
        </h2>
        <Link
          href="registrations/new"
          className="inline-flex items-center justify-center rounded-md border border-black px-5 py-4 text-center font-medium text-black hover:bg-opacity-90 dark:border-white dark:text-white lg:px-8 xl:px-10"
        >
          New Registration
        </Link>
      </div>
      <div className="flex flex-col gap-10">
        <Search path="/dashboard/registrations" />
        <RegistrationTable data={data} />
        <Pagination
          total={data.total}
          page={data.page}
          size={data.size}
          path="/dashboard/registrations"
        />
      </div>
    </>
  );
};

export default RegistrationPage;
