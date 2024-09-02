"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SERVER_API_URL } from "@/app/constant";
import { getErrorMessage } from "@/lib/utils";
import { revalidateTag } from "next/cache";

export async function createParameters( formData: any) {
  let jsonObject = formData;

  if (jsonObject.customer_id === "null") jsonObject.customer_id = null as any;
  if (jsonObject.product_id === "null") jsonObject.product_id = null as any;

  if (jsonObject.test_type_id !== "2" && jsonObject.product_id !== "null")
    jsonObject.product_id = null as any;

  console.log(jsonObject, jsonObject.methods, jsonObject.methods[0].parameters);

  

  const access_token = cookies().get("access_token");
  const res = await fetch(`${SERVER_API_URL}/parameters/`, {
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

  revalidateTag("Parameters");

  if (res.status === 201) {
    return {
      fieldErrors: null,
      type: "Success",
      message: "Parameter Created Successfully",
    };
  }
  // if (res.status === 201) redirect("/dashboard/parameters");
}

export async function updateParameter(
  id: string,
  prevState: any,
  formData: FormData,
) {
  let jsonObject = Object.fromEntries(formData.entries());

  if (jsonObject.customer_id === "null") jsonObject.customer_id = null as any;
  if (jsonObject.product_id === "null") jsonObject.product_id = null as any;

  if (jsonObject.test_type_id !== "2" && jsonObject.product_id !== "null"){
    jsonObject.product_id = null as any;
    jsonObject.max_limits=null as any;
    jsonObject.min_limits=null as any;
  }
 

  console.log(jsonObject);
  const access_token = cookies().get("access_token");
  const res = await fetch(`${SERVER_API_URL}/parameters/${id}`, {
    method: "PUT", // *GET, POST, PUT, DELETE, etc.
    // mode: "cors", // no-cors, *cors, same-origin
    headers: {
      "Content-Type": "application/json",
      // "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${access_token?.value}`,
    },
    body: JSON.stringify(jsonObject),
  });

  if (res.status == 422) {
    const resJson = await res.json();

    console.log(resJson);
    console.log(resJson.detail[0].loc);
    console.log(resJson.detail[0].input);
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

  revalidateTag("Parameters");

  if (res.status === 204) {
    return {
      fieldErrors: null,
      type: "Success",
      message: "Parameter Updated Successfully",
    };
  }
  // if (res.status === 204) redirect("/dashboard/parameters");
}
