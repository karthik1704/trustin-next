import SampleTable, { RegisterType } from "./samples-table";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { SERVER_API_URL } from "@/app/constant";
import { Metadata } from "next";
import Link from "next/link";
import axios from "axios";
import Pagination from "@/components/pagination";
import Search from "@/components/search-box";

export const metadata: Metadata = {
  title: "Samples | Trustin",
  description: "This is Users page ",
  // other metadata
};

async function getData(
  params: { [key: string]: string | string[] | undefined } | undefined,
) {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");

  // const res = await fetch(`${SERVER_API_URL}/samples/`, {
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${access_token?.value}`,
  //   },
  //   next: { tags: ["Samples"] },
  // });

  // // The return value is *not* serialized
  // // You can return Date, Map, Set, etc.

  // if (!res.ok) {
  //   // This will activate the closest `error.js` Error Boundary
  //   console.log(res);
  //   console.log("error");
  //   throw new Error("Failed to fetch data");
  // }

  // if (res.status === 401) redirect("/signin");

  // const samples = await res.json();

  // return samples;
  const page = parseInt((params?.page as string) || "1");
  const size = parseInt((params?.size as string) || "10");
  const search = params?.search || "";
  const sortBy = params?.sort_by || "id";
  const sortOrder = params?.sort_order || "desc";

  const response = await axios.get(`${SERVER_API_URL}/samples/`, {
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

const SamplePage = async ({
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
          Samples
        </h2>
        {/* <Link
          href="samples/new"
          className="inline-flex items-center justify-center rounded-md border border-black py-4 px-5 text-center font-medium text-black hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          New Sample
        </Link> */}
      </div>
      <div className="flex flex-col gap-10">
        <Search path="/dashboard/samples" />

        <SampleTable data={data} />
        <Pagination
          total={data.total}
          page={data.page}
          size={data.size}
          path="/dashboard/samples"
        />
      </div>
    </>
  );
};

export default SamplePage;
