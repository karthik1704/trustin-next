import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SERVER_API_URL } from "@/app/constant";
import {
  patchSampleWorkflow,
  patchSampleWorkflowTestResult,
  rejectSampleWorkflow,
  updateSamples,
} from "../actions";
import SampleWorkflowForm from "./sample-workflow-form";

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
  const sample = await res.json();
  const branches = await res2.json();
  const users = await res3.json();
  const currentUser = await res4.json();
  const batches = await res5.json();
  const parameters = await res6.json();
  // console.log(sample);
  return {
    sample,
    branches,
    users,
    currentUser,
    batches,
    test_params:parameters
  };
}

export type Data = {
  currentUser: { id: number; department_id: number };
  sample: {
    id: number;
    sample_id: string;
    sample_name: string;
    registration_id: number;
    status_id: number;
    department: string;
    assigned_to: number;
    received_quantity: number;
    batch_size: number;
    manufactured_date: string;
    expiry_date: string;
    batch_or_lot_no: string;

    created_by: number;
    updated_by: number;
    status: string;
    sample_test_parameters: [
      {
        id: number;
        sample_id: number;
        test_parameter_id: number;
        test_type: string;
        value: string;
        result: true;
        order: number;

        created_by: number;
        updated_by: number;
        test_parameter: {
          id: number;
          branch_id: number;
          test_type_id: number;
          product_id: number;
          customer_id: number;
          created_at: "2024-03-10T08:14:48.411Z";
          updated_at: "2024-03-10T08:14:48.411Z";
          parameter_code: string;
          testing_parameters: string;
          amount: number;
          method_or_spec: string;
          group_of_test_parameters: "string";
        };
      },
    ];
    registration: {
      code: string;
      id: number;
      company_name: string;
      customer_address_line1: string;
      customer_address_line2: string;
      test_type_id: number;
      city: string;
      state: string;
      pincode_no: string;
      gst: string;
      product_data:{
        id:number;
        product_code: string;
        product_name: string;
      };
    };
    sample_workflows: {
      id: number;
      sample_status_id: number;
      assigned_to: number | null;
      status: string;
      assignee: { first_name: string; last_name: string } | null;
      department: { id: number; name: string } | null;
      role: { id: number; name: string } | null;
      updated_at: string;
    }[];
    sample_history: [
      {
        id: number;
        from_status_id: number;
        to_status_id: number;
        assigned_to: number | null;
        comments: string | null;
        created_at: string;
        created_by: number;
        from_status: { id: number; name: string } | null;
        to_status: { id: number; name: string } | null;
        assignee: { first_name: string; last_name: string } | null;
        created_by_user: { first_name: string; last_name: string } | null;
      },
    ];
    status_data: {
      id: number;
      name: string;
    };
    assignee: {
      first_name: string;
      last_name: string;
      department: string;
    };
    batch?: {
      id: number;
      registration_id: number;
      batch_no: string;
      manufactured_date: string;
      expiry_date: string;
      batch_size: number;
      received_quantity: number;
      created_by: number;
      updated_by: number;
    };
    parameters: {
      id: number;
      branch_id: number;
      test_type_id: number;
      product_id: number;
      customer_id: number;
      created_at: "2024-03-10T08:14:48.411Z";
      updated_at: "2024-03-10T08:14:48.411Z";
      parameter_code: string;
      testing_parameters: string;
      amount: number;
      method_or_spec: string;
      group_of_test_parameters: "string";
    };
  };

  branches: {
    id: number;
    branch_name: string;
  }[];
  users: {
    id: number;
    first_name: string;
    last_name: string;
  }[];

  batches: {
    id: number;
    batch_no: string;
    manufactured_date: string;
    expiry_date: string;
    batch_size: number;
    received_quantity: number;
    created_by: number;
    updated_by: number;
  };
  test_params: {
    id: number;
    branch_id: number;
    test_type_id: number;
    product_id: number;
    customer_id: number;
    created_at: "2024-03-10T08:14:48.411Z";
    updated_at: "2024-03-10T08:14:48.411Z";
    parameter_code: string;
    testing_parameters: string;
    amount: number;
    method_or_spec: string;
    group_of_test_parameters: "string";
  };
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
  const updateSampleWithId = updateSamples.bind(
    null,
    id,
  );

  return (
    <>
      <Breadcrumb pageName="Sample WorkFlow" />

      <div className="grid grid-cols-1 items-center justify-center gap-9 sm:grid-cols-1 ">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <SampleWorkflowForm
            data={data}
            actionFn={patchSampleWorkflowWithId}
            actionFnResult={patchSampleWorkflowResultWithId}
            actionFnReject={rejectSampleWorkflowWithId}
            actionUpdateSample = {updateSampleWithId}
          />
        </div>
      </div>
    </>
  );
};

export default EditSamplePage;
