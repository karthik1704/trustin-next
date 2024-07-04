import Link from "next/link";
import { cookies } from "next/headers";
import CustomerTable from "./components/customerTable";
import { redirect } from "next/navigation";
import { useRouter } from 'next/router';
import axios from 'axios'
import Pagination from './components/pagination';
import Search from './components/search';
import { GetServerSideProps } from 'next';
import { Metadata } from "next";
import { SERVER_API_URL } from "@/app/constant";
import { useSearchParams } from 'next/navigation'

// import React from 'react';
// import axios from 'axios';
// import CustomerTable from './components/CustomerTable';
// import Pagination from './components/Pagination';
// import Search from './components/Search';

export type Data = {
  id: number;
  company_name: string;
  company_id: string;
  customer_code: string;
  email: string;
}[];



const fetchCustomers = async (params: { [key: string]: string | string[] | undefined; } | undefined) => {
  // const params = new URLSearchParams(window.location.search);
  // console.log(Object.values(params).indexOf("search"));
  // const params = useSearchParams()
  // if (!params){
  //    params = {}
  // }
  const page = parseInt(params?.page || '1');
  const size = parseInt(params?.size || '10');
  const search = params?.search || '';
  const sortBy = params?.sort_by || 'id';
  const sortOrder = params?.sort_order || 'asc';
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");
  const response = await axios.get(`${SERVER_API_URL}/customers/`, {
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

  return response.data;
};

const CustomerPage = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
})  => {
  console.log("#####3",params, searchParams?.search)
  
  const data = await fetchCustomers(searchParams);
  console.log(data)

  return (
    <>
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Customers
        </h2>
        <Link
          href="customers/new"
          className="inline-flex items-center justify-center rounded-md border border-black px-5 py-4 text-center font-medium text-black hover:bg-opacity-90 dark:border-white dark:text-white lg:px-8 xl:px-10"
        >
          New Customers
        </Link>
      </div>
      <div className="flex flex-col gap-10">
      <Search />
      <CustomerTable customers={data.data} />
      <Pagination total={data.total} page={data.page} size={data.size} />
      </div>
    </>
    
  );
};

export default CustomerPage;
