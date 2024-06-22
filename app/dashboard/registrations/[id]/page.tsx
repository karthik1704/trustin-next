import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import RegistrationEditForm from "./form";
import { cookies } from "next/headers";
import { SERVER_API_URL } from "@/app/constant";
import { redirect } from "next/navigation";
import { updateRegistration } from "../actions";
import Link from "next/link";
import { Data, RegistrationType, UpdateDataType } from "../typings";
import { FullParametersType } from "@/types/parametets";
import { TestReportForm } from "@/app/trf/typings";
import { parseArgs } from "util";

export const metadata: Metadata = {
  title: "Edit New Registration | Trustin",
  description: "This is Form Layout page for TailAdmin Next.js",
  // other metadata
};

type ParametersType = {
  id: number;
  testing_parameters: string;
  method_or_spec: string;
  test_type_id: number;
  test_type: {
    name: string;
  };
}[];

async function getData(id: string) {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");

  const res = await fetch(`${SERVER_API_URL}/registrations/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
  });
  // const res1 = await fetch(`${SERVER_API_URL}/trf/`, {
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${access_token?.value}`,
  //   },
  // });
  const res2 = await fetch(`${SERVER_API_URL}/customers/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
  });
  const res3 = await fetch(`${SERVER_API_URL}/branch/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
  });
  const res4 = await fetch(`${SERVER_API_URL}/products/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
  });
  // const res6 = await fetch(`${SERVER_API_URL}/samples/without-reg`, {
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${access_token?.value}`,
  //   },
  // });
  const res5 = await fetch(`${SERVER_API_URL}/parameters/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
  });
  const res6 = await fetch(`${SERVER_API_URL}/front-desks/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
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

  if (res.status === 401) redirect("/signin");
  // if (res1.status === 401) redirect("/signin");
  if (res2.status === 401) redirect("/signin");
  if (res3.status === 401) redirect("/signin");
  if (res4.status === 401) redirect("/signin");
  if (res4.status === 401) redirect("/signin");
  // if (res6.status === 401) redirect("/signin");
  if (res5.status === 401) redirect("/signin");
  if (res6.status === 401) redirect("/signin");

  const registration:RegistrationType = await res.json();
  // const trf:TestReportForm[] = await res1.json();
  const customers = await res2.json();
  const branches = await res3.json();
  const products = await res4.json();
  const parameters:FullParametersType[] = await res5.json();
  const frontDesks = await res6.json();
  // const samplesData = await res6.json();
 
  const mechParameters = parameters.filter(para=>para.test_type_id === 2)
  const microParameters = parameters.filter(para=>para.test_type_id === 1)

  return {
    registration,
    customers,
    branches,
    products,
    parameters,
    mechParameters,
    microParameters,
    frontDesks
  };
}

const EditRegistrationPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const data:UpdateDataType = await getData(id);
  const updateRegistrationWithId = updateRegistration.bind(null, id);
  return (
    <>
      <Breadcrumb pageName="Registration Form" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            {/* <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Contact Form
              </h3>
            </div> */}
          </div>
          <RegistrationEditForm data={data} updateFn={updateRegistrationWithId} />

          {/* <Link
            href={`/dashboard/registrations/${id}/samples`}
            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
          >
            Create Samples
          </Link> */}
        </div>
      </div>
    </>
  );
};

export default EditRegistrationPage;
