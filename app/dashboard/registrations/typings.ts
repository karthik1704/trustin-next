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
  order: number|string;
};
type RegistrationSamples = {
  sample_name: string;
  batch_or_lot_no: string;
  manufactured_date: string;
  expiry_date: string;
  batch_size: number;
  received_quantity: number;
};

export type TestType = string[] | number[];
export type CreateData = {
  branch_id: number | string;
  trf_code:  string;
  company_id: number | string;
  company_name: string;
  customer_address_line1: string;
  customer_address_line2: string;
  city: string;
  state: string;
  pincode_no: string;
  gst: string;
  date_of_received: string;
  product_id: number;
  test_type_id: number | string;
  license_no: string;
  nabl_logo: boolean;
  testing_process: string;
  sampled_by: string;
  sample_disposal_process: string;
  sample_name: string;
  batch_or_lot_no: string;
  manufactured_date: string;
  expiry_date: string;
  batch_size: number;
  received_quantity: number;
  controlled_quantity:number;
  no_of_samples: number;
  reports_send_by: string;
  micro_params: TestParam[];
  mech_params: TestParam[];
  samples: RegistrationSamples[]; 
};

type RegistrationUpdateSamples =  {
  id: number | null,
  sample_name: string;
  batch_or_lot_no: string;
  manufactured_date: string;
  expiry_date: string;
  batch_size: number;
  received_quantity: number;
};

export type UpdateData = {
  branch_id: number | string;
  trf_code: string;
  company_id: number | string;
  company_name: string;
  customer_address_line1: string;
  customer_address_line2: string;
  city: string;
  state: string;
  pincode_no: string;
  gst: string;
  date_of_received: string;
  product_id: number;
  test_type_id: number | string;
  license_no: string;
  nabl_logo: boolean|string;
  testing_process: string;
  sampled_by: string;
  sample_disposal_process: string;
  sample_name: string;
  batch_or_lot_no: string;
  manufactured_date: string;
  expiry_date: string;
  batch_size: number;
  received_quantity: number;
  no_of_samples: number;
  controlled_quantity:number;
  reports_send_by: string;
  micro_params: TestParam[];
  mech_params: TestParam[];
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

type Customer = {
  id: number;
  company_name: string;
  customer_code: string;
  customer_address_line1: string;
  customer_address_line2: string;
  city: string;
  state: string;
  pincode_no: string;
  website: string;
  email: string;
  nature_of_business: string;
  product_details: string;
  market: string;
  regulatory: string;
  pan: string;
  gst: string;
};

type Batch = {
  id: number;
  batch_no: string;
  manufactured_date: string; // using string to represent ISO date-time
  expiry_date: string;       // using string to represent ISO date-time
  batch_size: number;
  received_quantity: number;
  created_at: string;        // using string to represent ISO date-time
  updated_at: string;        // using string to represent ISO date-time
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
  batch: Batch
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

type RegSample={
  status_id: number;
  test_type_id: number | string;
  id:number;
  sample_name: string;
  sample_id: string;
  batch_or_lot_no: string;
  manufactured_date: string;
  expiry_date: string;
  batch_size: number;
  received_quantity: number;
}

export type RegistrationType = {
  id: number;
  trf_code: string;
  branch_id: number;
  // trf_id: number;
  company_id: number;
  company_name: string;
  customer_address_line1: string;
  customer_address_line2: string;
  city: string;
  state: string;
  pincode_no: string;
  gst: string;
  date_of_registration: string;
  date_of_received: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
  product_id: number;
  test_type_id: number | string;
  license_no: string;
  nabl_logo:  string;
  testing_process: string;
  sampled_by: string;
  sample_disposal_process: string;
  sample_name: string;
  batch_or_lot_no: string;
  manufactured_date: string;
  expiry_date: string;
  batch_size: number;
  received_quantity: number;
  no_of_samples: number;
  controlled_quantity: number;
  reports_send_by: string;
  
  samples: RegSample[];

  // trf: TestReportForm;
  // batches: UpdateBatchType[];
  test_params: TestParameter[];
  test_params_mech: TestParameter[];
  test_params_micro: TestParameter[];
  // test_types: string[];
};

export type UpdateDataType = Data & {
  registration: RegistrationType;
};
