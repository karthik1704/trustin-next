"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SERVER_API_URL } from "@/app/constant";
import { revalidateTag } from "next/cache";
import { getErrorMessage } from "@/lib/utils";

export async function createRegistration(jsonObject: any) {
  // jsonObject =jsonObject[0]
  console.log("CREATE");
  console.log(jsonObject);

  jsonObject.samples = jsonObject.samples.map((sample: any) => ({
    ...sample,
    test_types: JSON.parse(sample.test_types),
  }));
    // jsonObject.test_params = [
  //   ...jsonObject.test_params_mech,
  //   ...jsonObject.test_params_micro,
  // ];

  // delete jsonObject.test_params_mech;
  // delete jsonObject.test_params_micro;

  console.log(jsonObject);

  const access_token = cookies().get("access_token");

  const res = await fetch(`${SERVER_API_URL}/registrations/`, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    // mode: "cors", // no-cors, *cors, same-origin
    headers: {
      "Content-Type": "application/json",
      // "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${access_token?.value}`,
    },
    body: JSON.stringify(jsonObject),
  });

  if (res.status === 422) {
    const resJson = await res.json();

    console.log(resJson);
    console.log(resJson.detail[0].loc);
    console.log(resJson.detail[0].input);
  }

  if (res.status === 401) redirect("/signin");

  if (res.status !== 201) {
    const error = await res.json();
    return {
      fieldErrors: null,
      type: "Error",
      message: getErrorMessage(error.detail),
    };
  }

  revalidateTag("Registration");

  if (res.status === 201) {
    return {
      fieldErrors: null,
      type: "Success",
      message: "Registration created Successfully",
    };
  }
  // if (res.status===200) redirect("/dashboard/registrations");
}

export async function updateRegistration(id: string, data: any) {
  let jsonObject = data;
  console.log(data);
  jsonObject.samples = jsonObject.samples.map((sample: any) => ({
    ...sample,
    test_types: JSON.parse(sample.test_types),
  }));
  console.log(jsonObject);

  // jsonObject.test_types = jsonObject.test_types.map((type: any) => ({
  //   test_type_id: type,
  // }));
  // jsonObject.test_params = [
  //   ...jsonObject.test_params_mech,
  //   ...jsonObject.test_params_micro,
  // ];

  // delete jsonObject.test_params_mech;
  // delete jsonObject.test_params_micro;

  const access_token = cookies().get("access_token");

  const res = await fetch(`${SERVER_API_URL}/registrations/${id}`, {
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

  if (res.status !== 200) {
    const error = await res.json();
    return {
      fieldErrors: null,
      type: "Error",
      message: getErrorMessage(error.detail),
    };
  }

  revalidateTag("Registration");
  revalidateTag("Samples");

  if (res.status === 200) {
    return {
      fieldErrors: null,
      type: "Success",
      message: "Registration Updated Successfully",
    };
  }
  // if (res.status===200) redirect("/dashboard/registrations");
}
