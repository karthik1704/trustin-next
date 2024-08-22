import Link from "next/link";
import { cookies } from "next/headers";
import FrontDeskTable from "./quotation-table";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { SERVER_API_URL } from "@/app/constant";
import axios from "axios";
import Search from "@/components/search-box";
import Pagination from "@/components/pagination";

export const metadata: Metadata = {
  title: "Front Desk | Trustin",
  description: "This is Front Desk page ",
  // other metadata
};

async function getData(
  params: { [key: string]: string | string[] | undefined } | undefined,
) {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");
  console.log(access_token);
  
  const page = parseInt((params?.page as string) || "1");
  const size = parseInt((params?.size as string) || "10");
  const search = params?.search || "";
  const sortBy = params?.sort_by || "id";
  const sortOrder = params?.sort_order || "desc";

  const response = await axios.get(`${SERVER_API_URL}/front-desks/`, {
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
  if (response.status !== 200) {
    console.log("hi", response);
    throw new Error("Failed to fetch data");
  }
  return response.data;
}

export type Quotation={
 id: number;
}[];

export type Data = {
  data: Quotation;
  total: number;
  page: number;
};

const FrontDeskPage = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  // const data = await getData(searchParams);
  const data = {}
  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        Quotations
        </h2>
        <Link
          href="quotations/new"
          className="inline-flex items-center justify-center rounded-md border border-black px-5 py-4 text-center font-medium text-black hover:bg-opacity-90 dark:border-white dark:text-white lg:px-8 xl:px-10"
        >
          New Quotations
        </Link>
      </div>
      <div className="flex flex-col gap-10">
        <Search path="/dashboard/front-desk" />

        <FrontDeskTable data={data ?? []} />
        <Pagination
          total={data.total ?? 1}
          page={data.page ?? 1}
          size={data.size ?? 1}
          path="/dashboard/quotations"
        />
      </div>
    </>
  );
};

export default FrontDeskPage;
