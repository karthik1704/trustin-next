export type SampleTestParameters = {
  id: number;
  sample_id: number;
  test_parameter_id: number;
  test_type: string;
  value: string;
  result: true;
  order: number;
  quantity: number | null;
  created_by: number;
  updated_by: number;
  test_parameter: {
    id: number;
    branch_id: number;
    test_type_id: number;
    product_id: number;
    customer_id: number;
    created_at: string;
    updated_at: string;
    parameter_code: string;
    testing_parameters: string;
    amount: number;
    method_or_spec: string;
    group_of_test_parameters: string;
  };
};

export type SampleHistory = 
  {
    id: number;
    from_status_id: number;
    to_status_id: number;
    test_type_id: number;
    test_type: {
        id:number;
        name: string;
      }
    assigned_to: number | null;
    comments: string | null;
    created_at: string;
    created_by: number;
    from_status: { id: number; name: string } | null;
    to_status: { id: number; name: string } | null;
    assignee: { first_name: string; last_name: string } | null;
    created_by_user: { first_name: string; last_name: string } | null;
  }[];
export type SampleWorkflow = {
  id: number;
  sample_status_id: number;
  assigned_to: number | null;
  test_type_id: number;

  status: string;
  assignee: { first_name: string; last_name: string } | null;
  department: { id: number; name: string } | null;
  role: { id: number; name: string } | null;
  updated_at: string;
}[];

export type Sample = {
  id: number;
  sample_id: string;
  sample_name: string;
  registration_id: number;
  status_id: number;
  department: string;
  assigned_to: number;
  nabl_logo: boolean;
  samples_received: boolean;
  under_cdsco: boolean;
  received_quantity: number;
  batch_size: number;
  manufactured_date: string;
  expiry_date: string;
  testing_start_date: string | null;
  testing_end_date: string | null;
  batch_or_lot_no: string;
  test_type_id: number;
  tat: string;
  description: string;
  sample_issued: number | null;
  issued_to: string | null;
  sample_condition: string;
  sterilization_batch_no: string;

  created_by: number;
  updated_by: number;
  status: string;
  sample_test_parameters: SampleTestParameters[];
  sample_test_types: SampleTestType[];
  registration: {
    code: string;
    id: number;
    company_name: string;
    full_address: string;
    test_type_id: number;
    product_id: number;
    date_of_received: string;
    gst: string;
    product_data: {
      id: number;
      product_code: string;
      product_name: string;
    };
  };
  sample_workflows: SampleWorkflow;
  sample_history: SampleHistory;
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
    created_at: string;
    updated_at: string;
    parameter_code: string;
    testing_parameters: string;
    amount: number;
    method_or_spec: string;
    group_of_test_parameters: string;
  };
};

type TestType1 = {
  id: number;
  name: string;
};

// Type for the sample_test_types object
type SampleTestType = {
  id: number;
  sample_id: number;
  test_type_id: number;
  created_at: string; // Use 'string' for ISO 8601 datetime format
  updated_at: string; // Use 'string' for ISO 8601 datetime format
  test_type: TestType1;
};

export type Data = {
  currentUser: { id: number; department_id: number, qa_type_id:number };
  sample: Sample;
  sample_micro_params: SampleTestParameters[];
  sample_mech_params: SampleTestParameters[];
  sample_micro_workfolw: SampleWorkflow;
  sample_mech_workfolw: SampleWorkflow;
  sample_micro_history: SampleHistory;
  sample_mech_history: SampleHistory;

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
  }[];
};
