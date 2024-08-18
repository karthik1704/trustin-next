
"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SERVER_API_URL } from "@/app/constant";
import { revalidateTag } from "next/cache";
import { getErrorMessage } from "@/lib/utils";


export async function createSamples(data: any) {

  console.log(data)

  const access_token = cookies().get("access_token");

  const res = await fetch(`${SERVER_API_URL}/samples/`, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    // mode: "cors", // no-cors, *cors, same-origin
    headers: {
      "Content-Type": "application/json",
      // "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${access_token?.value}`,
    },
    body: JSON.stringify([data]),
  });

  console.log(res.status);

  if (res.status == 422) {
    const resJson = await res.json();

    console.log(resJson);
    console.log(resJson.detail[0].loc);
    console.log(resJson.detail[0].input);
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

  revalidateTag("Samples");

  if (res.status === 200) {
    return {
      fieldErrors: null,
      type: "Success",
      message: "Samples created Successfully",
    };
  }
  // if (res.status===200) redirect("/dashboard/samples");
}

export async function updateSamples(id: string, data: any) {

  console.log(data)

  const access_token = cookies().get("access_token");

  const res = await fetch(`${SERVER_API_URL}/samples/${id}`, {
    method: "PUT", // *GET, POST, PUT, DELETE, etc.
    // mode: "cors", // no-cors, *cors, same-origin
    headers: {
      "Content-Type": "application/json",
      // "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${access_token?.value}`,
    },
    body: JSON.stringify(data),
  });

  console.log(res.status);

  if (res.status == 422) {
    const resJson = await res.json();

    console.log(resJson);
    console.log(resJson.detail[0].loc);
    console.log(resJson.detail[0].input);
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

  revalidateTag("Samples");

  if (res.status === 200) {
    return {
      fieldErrors: null,
      type: "Success",
      message: "Samples Updated Successfully",
    };
  }
  // if (res.status===200) redirect("/dashboard/samples");
}




export async function patchSampleWorkflow(
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

  const res = await fetch(`${SERVER_API_URL}/samples/${id}`, {
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

  if (res.status === 204) redirect("/dashboard/samples");
}

export async function patchSampleWorkflowTestResult(id: string, data: any) {

  const access_token = cookies().get("access_token");

  const res = await fetch(`${SERVER_API_URL}/samples/${id}`, {
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
  // if (res.status===200) redirect("/dashboard/samples");
}

export async function rejectSampleWorkflow(id: string, data: any) {
 
  const access_token = cookies().get("access_token");

  const res = await fetch(`${SERVER_API_URL}/samples/${id}`, {
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
  // if (res.status===200) redirect("/dashboard/samples");
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

  revalidateTag("Samples");

  if (res.status === 200) {
    return {
      fieldErrors: null,
      type: "Success",
      message: "Mail Sent Shortly",
    };
  }
  // if (res.status===200) redirect("/dashboard/samples");
}
