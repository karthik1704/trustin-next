"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { SERVER_API_URL } from "@/app/constant";
import { revalidateTag } from "next/cache";
import { getErrorMessage } from "@/lib/utils";



export async function createInvoice( formData: any) {
  // let jsonObject = Object.fromEntries(formData.entries());

  const access_token = cookies().get("access_token");

  const res = await fetch(`${SERVER_API_URL}/invoices/`, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    // mode: "cors", // no-cors, *cors, same-origin
    headers: {
      "Content-Type": "application/json",
      // "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${access_token?.value}`,
    },
    body: JSON.stringify(formData),
  });

  if (res.status === 401) redirect("/signin");
  if (res.status == 422) {
    const resJson = await res.json();

    console.log(resJson);
    console.log(resJson.detail.map(d=>d.loc));
    console.log(resJson.detail[0].input);
  }


  if (res.status !== 201) {
    const error = await res.json();
    return {
      fieldErrors: null,
      type: "Error",
      message: getErrorMessage(error.detail),
    };
  }

  revalidateTag("invoices");


  if (res.status === 201) {
    const error = await res.json();
    console.log(error);
    return {
      fieldErrors: null,
      type: "Success",
      message: "Invoice Created Successfully",
    };
  }
  // if (res.status===201) redirect("/dashboard/customers");
}

export async function updateInvoice(
  id: any,
  formData: any,
) {
  // let jsonObject = Object.fromEntries(formData.entries());

  const access_token = cookies().get("access_token");
  const res = await fetch(`${SERVER_API_URL}/invoices/${id}`, {
    method: "PUT", // *GET, POST, PUT, DELETE, etc.
    // mode: "cors", // no-cors, *cors, same-origin
    headers: {
      "Content-Type": "application/json",
      // "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${access_token?.value}`,
    },
    body: JSON.stringify(formData),
  });

  if (res.status === 401) redirect("/signin");

  // if (res.status === 422) {
  //   const resJson = await res.json();

  //   console.log(resJson);
  //   console.log(resJson.detail[0].loc);
  //   console.log(resJson.detail[0].input);
  // }

  if (res.status !== 200) {
    const error = await res.json();
    console.log(error);
    console.log(error.detail[0].loc);
    console.log(error.detail[0].input);
    console.log(error);
    return {
      fieldErrors: null,
      type: "Error",
      message: getErrorMessage(error.detail),
    };
  }

  revalidateTag("front-desk");

  if (res.status === 200) {
    return {
      fieldErrors: null,
      type: "Success",
      message: "Front Desk  Updated Successfully",
    };
  }
  // if (res.status===204) redirect("/dashboard/customers");
}
