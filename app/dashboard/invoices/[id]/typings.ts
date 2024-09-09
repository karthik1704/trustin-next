export type Customer = {
  pincode_no: string;
  gst: string;
  customer_code: string;
  website: string;
  created_at: string;
  id: number;
  company_name: string;
  email: string;
  company_id: number | null;
  nature_of_business: string;
  customer_address_line1: string;
  product_details: string;
  customer_address_line2: string;
  market: string;
  updated_at: string;
  city: string;
  regulatory: string;
  state: string;
  pan: string;
};
type Workflow = {
  id: number;
  invoice_status_id: number;
  assigned_to: number | null;
  status: string;
  assignee: { first_name: string; last_name: string } | null;
  department: { id: number; name: string } | null;
  role: { id: number; name: string } | null;
  updated_at: string;
}[];

export type History = {
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
};

type InvoiceParameter = {
  id: number;
  test_parameter: string;
  sac: string;
  testing_charge: number;
  no_of_tested: number;
  total_testing_charge: number;
};

export type Invoice = {
  assigned_to: number;
  status: string;
  customer: {
    id: number;
    company_name: string; 
  };
  invoice_parameters: InvoiceParameter[];
  invoice_workflows: Workflow[];
  invoice_history: History[];
  status_id: number;
  id: number;
  invoice_code: string;
  lut_arn: string;
  invoice_type: string;
  customer_id: number;
  customer_address: string;
  customer_email: string;
  customer_gst: string;
  customer_ref_no: string;
  quotation_ref_no: string;
  sample_id_nos: string;
  sub_total: number;
  grand_total: number;
  discount: number;
  sgst: number;
  cgst: number;
  igst: number;
  currency: string;
  tested_type: string;
  updated_at: string;
};

export type Data = {
  // customers: Customer[];
  invoice: Invoice;
 
  currentUser?: {
    id: number;
    role_id: number;
    department_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    designation: string;
  };

};
