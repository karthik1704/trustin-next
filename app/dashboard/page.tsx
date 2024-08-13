import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { SERVER_API_URL } from "@/app/constant";
import { formatDate, getDateRange } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Trustin | Dashboard",
  description: "This is Home Blog page for TailAdmin Next.js",
  // other metadata
};

export type RegistrationData = {
  week: string;
  count: number;
};

export type FollowupData = {
  followup_count: number;
  user_id: number;
  user_name: string;
};

export type DashboardInfo = {
  customer: number;
  product: number;
  registration_count: number;
  followup_count: number;
  sample_count: number;
  registration_data: RegistrationData[];
  followup_count_by_assigned_to: FollowupData[];
};

export type DashboardData = {
  dashboard: DashboardInfo;
  menus: string[];
};

const { startDate, endDate } = getDateRange();

// Format the dates as strings (in DD-MM-YYYY format)
const startDateString = formatDate(startDate);
const endDateString = formatDate(endDate);

async function getData(start_date: string, end_date: string) {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");

  if (start_date === "" || start_date === undefined)
    start_date = startDateString;
  if (end_date === "" || end_date === undefined) end_date = endDateString;

  console.log(start_date, end_date);

  const res = await fetch(
    `${SERVER_API_URL}/dashboard/?start_date_str=${start_date}&${end_date}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token?.value}`,
      },
      next: {
        tags: ["Dashboard", "Users", "Followup", "Registration", "Samples"],
        revalidate: 100000,
      },
    },
  );
  const res1 = await fetch(`${SERVER_API_URL}/users/menus`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
    next: {
      tags: ["Menus"],
      revalidate: 100000,
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
  if (!res1.ok) {
    // This will activate the closest `error.js` Error Boundary
    // console.log(res)
    // throw new Error("Failed to fetch data");
    console.log("error1");
  }

  if (res.status === 401) redirect("/signin");
  if (res1.status === 401) redirect("/signin");

  const dashboard = await res.json();
  const menusRes = await res1.json();

  const menus = menusRes.map((menu: { id: number; name: string }) => menu.name);

  return { dashboard, menus };
}

async function getDataSample(q: string | undefined) {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");

  if (q === "" || q === undefined) return {sample:null, status:null};

  const res = await fetch(`${SERVER_API_URL}/dashboard/sample/?q=${q}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
    next: {
      tags: ["Dashboard", "Samples"],
      revalidate: 100000,
    },
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    // console.log(res)
    // throw new Error("Failed to fetch data");
    console.log("error");
  }

  if (res.status === 401) redirect("/signin");
  if (res.status === 404) return {sample: null, status:404};

  const sample = await res.json();
  console.log(sample)

  return {sample: sample,status:200};
}

export default async function DashboardPage({
  searchParams: { start_date_str, end_date_str, q },
}: {
  searchParams: {
    start_date_str: string | undefined;
    end_date_str: string | undefined;
    q: string | undefined;
  };
}) {
  console.log(start_date_str, end_date_str);
  const data: DashboardData = await getData(
    start_date_str ?? "",
    end_date_str ?? "",
  );
  const sample: any = await getDataSample(q);
  return (
    <>
      <ECommerce
        data={data}
        startDate={start_date_str}
        endDate={end_date_str}
        sample={sample}
      />
    </>
  );
}
