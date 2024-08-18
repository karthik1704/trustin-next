import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PDF_URL, SERVER_API_URL } from "@/app/constant";
import {
  patchSampleWorkflow,
  patchSampleWorkflowTestResult,
  rejectSampleWorkflow,
  updateSamples,
} from "../actions";
import SampleWorkflowForm from "./sample-workflow-form";
import { Data, Sample } from "./typings";
import { User } from "@/types/user";
import QRCode from 'qrcode';

export const metadata: Metadata = {
  title: "Sample Workflow | Trustin",
  description: "This is Form Layout page for TailAdmin Next.js",
  // other metadata
};

async function getData(id: string) {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");

  const res = await fetch(`${SERVER_API_URL}/samples/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
  });

  const res2 = await fetch(`${SERVER_API_URL}/branch/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
  });
  const res3 = await fetch(`${SERVER_API_URL}/users/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
  });
  const res4 = await fetch(`${SERVER_API_URL}/users/me`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
  });

  const res5 = await fetch(`${SERVER_API_URL}/batches/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
  });

  const res6 = await fetch(`${SERVER_API_URL}/parameters/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token?.value}`,
    },
  });

  const res7 = await fetch(`${SERVER_API_URL}/users/departments/4`, {
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
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    // console.log(res)
    // throw new Error("Failed to fetch data");
    console.log("error");
  }
  if (!res2.ok) {
    // This will activate the closest `error.js` Error Boundary
    // console.log(res)
    // throw new Error("Failed to fetch data");
    console.log("error2");
  }
  if (!res3.ok) {
    // This will activate the closest `error.js` Error Boundary
    // console.log(res)
    // throw new Error("Failed to fetch data");
    console.log("error3");
  }
  if (!res4.ok) {
    // This will activate the closest `error.js` Error Boundary
    // console.log(res)
    // throw new Error("Failed to fetch data");
    console.log("error4");
  }
  if (!res5.ok) {
    // This will activate the closest `error.js` Error Boundary
    // console.log(res)
    // throw new Error("Failed to fetch data");
    console.log("error5");
  }
  if (!res6.ok) {
    // This will activate the closest `error.js` Error Boundary
    // console.log(res)
    // throw new Error("Failed to fetch data");
    console.log("error5");
  }
  if (!res7.ok) {
    // This will activate the closest `error.js` Error Boundary
    // console.log(res)
    // throw new Error("Failed to fetch data");
    console.log("error5");
  }
  const sample: Sample = await res.json();
  const branches = await res2.json();
  const users = await res3.json();
  const currentUser = await res4.json();
  const batches = await res5.json();
  const parameters = await res6.json();
  const  hodUsers:User[] = await res7.json();
  // console.log(sample);

  const sample_micro_params = sample.sample_test_parameters.filter(
    (test) => test.test_parameter.test_type_id === 1,
  )??[];
  const sample_mech_params = sample.sample_test_parameters.filter(
    (test) => test.test_parameter.test_type_id === 2,
  )??[];
  const sample_micro_workfolw = sample.sample_workflows.filter(
    (work) => work.test_type_id === 1,
  ) ?? [];
  const sample_mech_workfolw = sample.sample_workflows.filter(
    (work) => work.test_type_id === 2
  )??[];
  const sample_micro_history = sample.sample_history.filter(
    (histroy) => histroy.test_type?.id === 1,
  )?? [];
  const sample_mech_history = sample.sample_history.filter(
    (histroy) => histroy.test_type?.id === 2,
  )??[];

  const microUsers = hodUsers.filter(user=>user.qa_type_id===1 && [14,15,30].includes(user.id))
  const mechUsers = hodUsers.filter(user=>user.qa_type_id===2 &&[24,25,16].includes(user.id))

  return {
    sample,
    branches,
    users,
    currentUser,
    batches,
    test_params: parameters,
    sample_mech_history,
    sample_mech_params,
    sample_mech_workfolw,
    sample_micro_history,
    sample_micro_params,
    sample_micro_workfolw,
    microUsers,
    mechUsers
  };
}



const generateQRCode = async (text:string) => {
  try {
    const url = await QRCode.toDataURL(text);
    return url;
  } catch (err) {
    console.error(err);
  }
};

const EditSamplePage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const data: Data = await getData(id);
  //   const updateProductWithId = updateProducts.bind(null, id);
  const patchSampleWorkflowWithId = patchSampleWorkflow.bind(null, id);
  const patchSampleWorkflowResultWithId = patchSampleWorkflowTestResult.bind(
    null,
    id,
  );
  const rejectSampleWorkflowWithId = patchSampleWorkflowTestResult.bind(
    null,
    id,
  );
  const updateSampleWithId = updateSamples.bind(null, id);
  const qrcode = await generateQRCode(`${PDF_URL}/pdf/${id}`)

  return (
    <>
      <Breadcrumb pageName="Sample WorkFlow" />

      <div className="grid grid-cols-1 items-center justify-center gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <SampleWorkflowForm
            data={data}
            actionFn={patchSampleWorkflowWithId}
            actionFnResult={patchSampleWorkflowResultWithId}
            actionFnReject={rejectSampleWorkflowWithId}
            actionUpdateSample={updateSampleWithId}
            qr={qrcode as string}
          />
        
        </div>
       
      </div>
     
    </>
  );
};

export default EditSamplePage;
