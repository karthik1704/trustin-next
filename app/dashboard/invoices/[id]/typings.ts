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

type Invoice = {
  id: number;
  invoice_code: string;
  invoice_type: string;
  customer_id: number;
  customer_address: string;
  customer_email: string;
  customer_gst: string;
  customer_ref_no: string;
  quotation_ref_no: string;
  sample_id_nos: string;
  sub_total: string;
  grand_total: string;
  discount: string;
  sgst: string;
  cgst: string;
  currency: string;
  tested_type: string;
};

export type Data = {
  customers: Customer[];
  invoices: Invoice;
 
  user?: {
    role_id: number,
    
  }
};
