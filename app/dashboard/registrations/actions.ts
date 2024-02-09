// @ts-nocheck

"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createBranch(formData: FormData) {
  let jsonObject = Array.from(formData.entries()).reduce(
    (acc, [key, value]) => {
      acc[key] = value;
      return acc;
    },
    {}
  );

  const access_token = cookies().get("access_token");

  const res = await fetch("http://localhost:8000/branch/", {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    // mode: "cors", // no-cors, *cors, same-origin
    headers: {
      "Content-Type": "application/json",
      // "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${access_token?.value}`,
    },
    body: JSON.stringify(jsonObject),
  });

  if (res.status == 422) {
    const resJson = await res.json()
    console.log(resJson)
    resJson.detail.map((error) => {
      console.log(error.loc);
      // console.log(error.input)
    });
  }


  if (res.status === 401) redirect("/signin");
  if (res.status === 201) redirect("/dashboard/branches");
}

export async function updateBranch(id: string, formData: FormData) {
  let jsonObject = Object.fromEntries(formData.entries());

  const access_token = cookies().get("access_token");

  const res = await fetch(`http://localhost:8000/branch/${id}`, {
    method: "PUT", // *GET, POST, PUT, DELETE, etc.
    // mode: "cors", // no-cors, *cors, same-origin
    headers: {
      "Content-Type": "application/json",
      // "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${access_token?.value}`,
    },
    body: JSON.stringify(jsonObject),
  });

  

  if (res.status === 401) redirect("/signin");
  if (res.status === 204) redirect("/dashboard/branches");
}
