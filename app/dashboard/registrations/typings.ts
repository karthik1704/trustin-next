import { TestReportForm } from "@/app/trf/typings";
import { BranchType } from "../branches/branch-table";
import { FullParametersType } from "@/types/parametets";

type BatchCreate = {
  batch_no: string;
  manufactured_date: string;
  expiry_date: string;
  batch_size: number;
  received_quantity: number;
};

type UpdateBatchType = BatchCreate & { id: string | null };

type TestParam = {
  test_params_id: number | string;
  quantity: number;
  order: number | string;
};
type RegistrationSamples = {
  sample_name: string;
  batch_or_lot_no: string;
  description: string;
  sample_condition: string;
  sterilization_batch_no: string;
  // test_type_id: string | number;
  test_types: string | number[];
  manufactured_date: string | null;
  tat: string | null;
  expiry_date: string | null;
  batch_size: string;
  received_quantity: string;
  test_params: {
    test_params_id: number | string;
    order: number;
  }[];
};

export type TestType = string[] | number[];
export type CreateData = {
  // branch_id: number | string;

  // trf_code: string;
  company_id: number | string;
  front_desk_id: number | string;
  company_name: string;
  full_address: string;
  // customer_address_line1: string;
  // customer_address_line2: string;
  // city: string;
  // state: string;
  // pincode_no: string;
  manufactured_by:string;
  contact_person_id: number | string;
  customer_reference_no: string;
  contact_person_name: string;
  contact_email: string;
  contact_number: string;
  gst: string;
  date_of_received: string;
  product_id: number | string;
  // test_type_id: number | string;
  license_no: string;
  // nabl_logo: boolean;
  testing_process: string;
  sampled_by: string;
  sample_disposal_process: string;
  // sample_name: string;
  // batch_or_lot_no: string;
  // manufactured_date: string;
  // expiry_date: string;
  batch_size: number;
  // received_quantity: number;
  // controlled_quantity: number;
  // no_of_samples: number;
  no_of_batches: number;
  reports_send: string;
  status: string;
  // micro_params: TestParam[];
  // mech_params: TestParam[];
  samples: RegistrationSamples[];
};

type RegistrationUpdateSamples = {
  id: number | string;
  sample_name: string;
  batch_or_lot_no: string;
  manufactured_date: string | null;
  tat: string | null;
  expiry_date: string | null;
  description: string;
  sample_condition: string;
  sterilization_batch_no: string;
  batch_size: string;
  received_quantity: string;
  test_types: number[] | string;
  test_params: {
    test_params_id: number | string;
    order: number;
  }[];
};

export type UpdateData = {
  // branch_id: number | string;
  // trf_code: string;
  front_desk_id: number | string;
  company_id: number | string;
  company_name: string;
  full_address: string;
  // customer_address_line1: string;
  // customer_address_line2: string;
  // city: string;
  // state: string;
  // pincode_no: string;
  // contact_person_id:number|string;

  manufactured_by: string;
  customer_reference_no: string;
  contact_person_name: string;
  contact_email: string;
  contact_number: string;
  gst: string;
  date_of_received: string;
  product_id: number;
  // test_type_id: number | string;
  license_no: string;
  // nabl_logo: boolean | string;
  testing_process: string;
  sampled_by: string;
  sample_disposal_process: string;
  // sample_name: string;
  // batch_or_lot_no: string;
  // manufactured_date: string;
  // expiry_date: string;
  // batch_size: number;
  // received_quantity: number;
  // no_of_samples: number;
  // controlled_quantity: number;
  no_of_batches: number;
  reports_send: string;
  status: string;
  // micro_params: TestParam[];
  // mech_params: TestParam[];
  samples: RegistrationUpdateSamples[];
};

export type ParametersType = {
  id: number;
  branch: { branch_name: string };
  test_type: { name: string };
  test_type_id: number;
  product: { product_name: string } | null;
  parameter_code: string;
  testing_parameters: string;
  amount: number;
  method_or_spec: string;
  group_of_test_parameters: string;
}[];

type Products = {
  product_code: string;
  created_at: string;
  id: number;
  branch_id: any; // You may need to replace `any` with the appropriate type
  product_name: string;
  description: string;
  updated_at: string | null;
};

type ProductsArray = Products[];

type Product = {
  id: number;
  product_code: string;
  product_name: string;
};

export type ContactPerson = {
  person_name: string;
  mobile_number: string;
  contact_email: string;
  customer_id: 293;
  designation: string | null;
  id: number;
  landline_number: string;
};

export type Customer = {
  id: number;
  company_name: string;
  customer_code: string;
  full_address: string;
  // customer_address_line1: string;
  // customer_address_line2: string;
  // city: string;
  // state: string;
  // pincode_no: string;
  // website: string;
  // nature_of_business: string;
  // product_details: string;
  // market: string;
  // regulatory: string;
  email: string;
  pan: string;
  gst: string;
  contact_persons: ContactPerson[];
};

type Batch = {
  id: number;
  batch_no: string;
  manufactured_date: string; // using string to represent ISO date-time
  expiry_date: string; // using string to represent ISO date-time
  batch_size: number;
  received_quantity: number;
  created_at: string; // using string to represent ISO date-time
  updated_at: string; // using string to represent ISO date-time
  created_by: number;
  updated_by: number;
  product_id: number;
  customer_id: number;
  product: Product;
  customer: Customer;
};

type Registration = {
  code: string;
};

export type SampleRecord = {
  id: number;
  sample_id: string;
  name: string;
  registration_id: number;
  status_id: number;
  test_type_id: number;
  assigned_to: number;
  batch_id: number;
  status: string;
  created_at: string; // using string to represent ISO date-time
  updated_at: string; // using string to represent ISO date-time
  created_by: number;
  updated_by: number;
  registration: Registration;
  batch: Batch;
};

export type FrontDesks = {
  customer_id: number;
  courier_name: string;
  date_of_received: string;
  received_condition: string;
  temperature: string;
  department_id: number;
  status: string;
  id: number;
  customer: {
    id: number;
    company_name: string;
  };
  user_received_by: {
    first_name: string;
    last_name: string;
  };
};

export type Data = {
  trf?: TestReportForm[];
  trflist?: { label: string; value: string }[];
  parameters?: FullParametersType[];
  mechParameters?: FullParametersType[];
  microParameters?: FullParametersType[];
  customers: Customer[];
  branches: BranchType;
  products: ProductsArray;
  samples?: SampleRecord[];
  frontDesks: FrontDesks[];
};

type TestTypeData = {
  id: number;
  registration_id: number;
  test_type_id: number;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
};

export interface TestParameter {
  id: number;
  registration_id: number;
  test_params_id: number;
  quantity: number;
  order: number | string;
  created_at: string;
  updated_at: string;
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
}

// Type for the test_type object
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

type RegSample = {
  status_id: number;
  // test_type_id: number | string;
  test_types: number[] | string;
  id: number;
  sample_name: string;
  sample_id: string;
  batch_or_lot_no: string;
  description: string;
  sample_condition: string;
  sterilization_batch_no: string;
  manufactured_date: string;
  tat: string;
  expiry_date: string;
  batch_size: string;
  received_quantity: string;
  sample_test_parameters: {
    id: number;
    sample_id: number;
    order: number;
    test_parameter_id: number;

    test_parameter: FullParametersType;
  }[];
  sample_test_types: SampleTestType[];

};



export type RegistrationType = {
  id: number;
  // trf_code: string;
  // branch_id: number;
  // trf_id: number;
  company_id: number;
  front_desk_id: number;
  company_name: string;
  full_address: string;
  customer_reference_no: string;
  contact_person_name: string;
  contact_email: string;
  contact_number: string;
  manufactured_by: string;

  // customer_address_line1: string;
  // customer_address_line2: string;
  // city: string;
  // state: string;
  // pincode_no: string;
  gst: string;
  date_of_registration: string;
  date_of_received: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
  product_id: number;
  // test_type_id: number | string;
  license_no: string;
  // nabl_logo: string;
  testing_process: string;
  sampled_by: string;
  sample_disposal_process: string;
  // sample_name: string;
  // batch_or_lot_no: string;
  // manufactured_date: string;
  // expiry_date: string;
  // batch_size: number;
  // received_quantity: number;
  // no_of_samples: number;
  no_of_batches: number;
  // controlled_quantity: number;
  reports_send: string;
  status: string;
  samples: RegSample[];

  // trf: TestReportForm;
  // batches: UpdateBatchType[];
  // test_params: TestParameter[];
  // test_params_mech: TestParameter[];
  // test_params_micro: TestParameter[];
  // test_types: string[];
};

export type UpdateDataType = Data & {
  registration: RegistrationType;
};
