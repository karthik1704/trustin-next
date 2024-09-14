export type Customer = {
  city: string;
  company_id: number | null;
  company_name: string;
  created_at: string;
  customer_address_line1: string;
  customer_address_line2: string;
  customer_code: string;
  email: string;
  gst: string;
  id: number;
  market: string;
  nature_of_business: string;
  pan: string;
  pincode_no: string;
  product_details: string;
  regulatory: string;
  state: string;
  updated_at: string;
  website: string;
};

type Workflow = {
  assigned_to: number | null;
  assignee: { first_name: string; last_name: string } | null;
  department: { id: number; name: string } | null;
  id: number;
  invoice_status_id: number;
  role: { id: number; name: string } | null;
  status: string;
  updated_at: string;
};

export type History = {
  assigned_to: number | null;
  assignee: { first_name: string; last_name: string } | null;
  comments: string | null;
  created_at: string;
  created_by: number;
  created_by_user: { first_name: string; last_name: string } | null;
  from_status: { id: number; name: string } | null;
  from_status_id: number;
  id: number;
  to_status: { id: number; name: string } | null;
  to_status_id: number;
};

type InvoiceParameter = {
  id: number;
  no_of_tested: number;
  sac: string;
  test_parameter: string;
  testing_charge: number;
  total_testing_charge: number;
};

export type Invoice = {
  assigned_to: number;
  authorized_sign?: User | null;
  authorized_sign_id: number | null;
  cgst: number;
  contact_person_name: string;
  currency: string;
  customer: {
    company_name: string;
    id: number;
  };
  customer_address: string;
  customer_email: string;
  customer_gst: string;
  customer_id: number;
  contact_phone: string;
  customer_ref_no: string;
  discount: number;
  grand_total: number;
  id: number;
  igst: number;
  invoice_mode: "INVOICE" | "PERFORMA_INVOICE";
  invoice_code: string;
  invoice_history: History[];
  invoice_parameters: InvoiceParameter[];
  invoice_type: string;
  invoice_workflows: Workflow[];
  lut_arn: string;
  note: string;
  quotation_ref_no: string;
  sample_id_nos: string;
  sgst: number;
  status: string;
  status_id: number;
  sub_total: number;
  tested_type: "BATCHES" | "TESTED" | "PIECES" | "LOCATION";
  updated_at: string;
};

type User = {
  department_id: number;
  designation: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  phone_number: string;
  role_id: number;
}

export type Data = {
  currentUser?: User;
  invoice: Invoice;
};
