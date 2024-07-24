
"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { SERVER_API_URL } from "@/app/constant";
import { revalidateTag } from "next/cache";
import { getErrorMessage } from "@/lib/utils";



const contactPersonsSchema = z.object({
  person_name: z.string(),
  designation: z.string(),
  mobile_number: z.string().refine((value) => /\d{10}/.test(value), {
    message: "Mobile number must be a 10-digit numeric value.",
  }),
  landline_number: z.string().optional(), // Optional field
  contact_email: z.string().email(),
});

const customerSchema = z.object({
  company_name: z.string(),
  customer_address_line1: z.string(),
  customer_address_line2: z.string(),
  city: z.string(),
  state: z.string(),
  pincode_no: z.string(),
  website: z.string(),
  email: z.string().email(),
  nature_of_business: z.string(),
  product_details: z.string(),
  market: z.string(),
  regulatory: z.string(),
  pan: z.string(),
  gst: z.string(),
  contact_persons: z.array(contactPersonsSchema),
});

export async function createCustomers(prevState:any, formData: any) {
  // let jsonObject = Object.fromEntries(formData.entries());
  let jsonObject = formData;

  // console.log(jsonObject);
  const access_token = cookies().get("access_token");

  const res = await fetch(`${SERVER_API_URL}/customers/`, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    // mode: "cors", // no-cors, *cors, same-origin
    headers: {
      "Content-Type": "application/json",
      // "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${access_token?.value}`,
    },
    body: JSON.stringify(jsonObject),
  });

  if (res.status === 401) redirect("/signin");

  if (res.status !== 201) {
    const error = await res.json();
    return {
      fieldErrors: null,
      type: "Error",
      message: getErrorMessage(error.detail),
    };
  }

  revalidateTag("Customers");

  if (res.status === 201) {
    return {
      fieldErrors: null,
      type: "Success",
      message: "Customer Created Successfully",
    };
  }
  // if (res.status===201) redirect("/dashboard/customers");
}

export async function updateCustomers(id:any, pervState:any, formData: any) {


  // console.log(jsonObject);
  const access_token = cookies().get("access_token");
  const res = await fetch(`${SERVER_API_URL}/customers/${id}`, {
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

  if (res.status !== 204) {
    const error = await res.json();
    return {
      fieldErrors: null,
      type: "Error",
      message: getErrorMessage(error.detail),
    };
  }

  revalidateTag("Customers");

  if (res.status === 204) {
    return {
      fieldErrors: null,
      type: "Success",
      message: "Customer Updated Successfully",
    };
  }
  // if (res.status===204) redirect("/dashboard/customers");
}
