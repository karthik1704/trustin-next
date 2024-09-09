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
    // Log detailed error information
    if (Array.isArray(resJson.detail)) {
      resJson.detail.forEach((error: { loc: any[]; msg: any; type: any; }, index: number) => {
        console.error(`Validation Error ${index + 1}:`);
        console.error(`  Location: ${error.loc.join(' > ')}`);
        console.error(`  Message: ${error.msg}`);
        console.error(`  Error Type: ${error.type}`);
      });
    }

    // Log the input that caused the first error
    if (resJson.detail[0] && resJson.detail[0].input) {
      console.error('Input causing the first error:', resJson.detail[0].input);
    }
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

  if (res.status !== 204) {
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

  if (res.status === 204) {
    return {
      fieldErrors: null,
      type: "Success",
      message: "Invoice Updated Successfully",
    };
  }
  // if (res.status===204) redirect("/dashboard/customers");
}





export async function patchInvoiceWorkflow(
  id: string,
  prevState: any,
  formData: FormData,
) {
  
  if(!formData){
    return{
      fieldErrors: null,
      type: "Error",
      message: "Oh, Snap, Data not pass-through",
    }
  }

  let jsonObject =Object.fromEntries(formData.entries());
  jsonObject.test_params = [] as any;
  console.log(jsonObject);

  const access_token = cookies().get("access_token");

  const res = await fetch(`${SERVER_API_URL}/invoices/${id}`, {
    method: "PATCH", // *GET, POST, PUT, DELETE, etc.
    // mode: "cors", // no-cors, *cors, same-origin
    headers: {
      "Content-Type": "application/json",
      // "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${access_token?.value}`,
    },
    body: JSON.stringify(jsonObject),
  });

  if (res.status === 422) {
    const response = await res.json();
    console.log(response);
    console.log(response.detail[0].loc);
    console.log(response.detail[0].input);
  }

  if (res.status === 401) redirect("/signin");

  if (res.status !== 204) {
    const error = await res.json();
    return {
      fieldErrors: null,
      type: "Error",
      message: getErrorMessage(error.detail),
    };
  }

  revalidateTag("Samples");

  if (res.status === 204) {
    return {
      fieldErrors: null,
      type: "Success",
      message: "Status updated Successfully",
    };
  }

  if (res.status === 204) redirect("/dashboard/invoices");
}

export async function patchInvoiceWorkflowTest(id: string, data: any) {

  const access_token = cookies().get("access_token");

  const res = await fetch(`${SERVER_API_URL}/invoices/${id}`, {
    method: "PATCH", // *GET, POST, PUT, DELETE, etc.
    // mode: "cors", // no-cors, *cors, same-origin
    headers: {
      "Content-Type": "application/json",
      // "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${access_token?.value}`,
    },
    body: JSON.stringify(data),
  });

  if (res.status === 422) {
    const response = await res.json();
    console.log(response);
    console.log('Validation errors:');
    response.detail.forEach((error: any, index: number) => {
      console.log(`Error ${index + 1}:`);
      console.log(`  Location: ${error.loc.join(' > ')}`);
      console.log(`  Input: ${error.input}`);
      console.log(`  Type: ${error.type}`);
      console.log(`  Message: ${error.msg}`);
      console.log('---');
    });
  }

  if (res.status === 401) redirect("/signin");

  if (res.status !== 204) {
    const error = await res.json();
    return {
      fieldErrors: null,
      type: "Error",
      message: getErrorMessage(error.detail),
    };
  }

  revalidateTag("Ivoices");

  if (res.status === 204) {
    return {
      fieldErrors: null,
      type: "Success",
      message: "Status updated Successfully",
    };
  }

}



export async function sentMail( data: any) {
 
  const access_token = cookies().get("access_token");

  const res = await fetch(`${SERVER_API_URL}/email/`, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    // mode: "cors", // no-cors, *cors, same-origin
    headers: {
      "Content-Type": "application/json",
      // "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${access_token?.value}`,
    },
    body: JSON.stringify(data),
  });

  if (res.status === 422) {
    const response = await res.json();
    console.log(response);
    console.log(response.detail[0].loc);
    console.log(response.detail[0].input);
  }
  if (res.status === 401) redirect("/signin");

  if (res.status !== 200) {
    const error = await res.json();
    return {
      fieldErrors: null,
      type: "Error",
      message: getErrorMessage(error.detail),
    };
  }

  revalidateTag("Invoices");

  if (res.status === 200) {
    return {
      fieldErrors: null,
      type: "Success",
      message: "Mail Sent Shortly",
    };
  }
  // if (res.status===200) redirect("/dashboard/invoices");
}
