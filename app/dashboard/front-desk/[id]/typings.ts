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

type FrontDesk = {
  customer_id: number | string;
  courier_name: string;
  date_of_received: string;
  received_condition: string;
  temperature: string;
  deparment_id: number;
  status: string;
  id: number;
  customer: Customer;
};

export type Data = {
  customers: Customer[];
  frontDesk: FrontDesk;
  departments: {
    id: number;
    name: string;
  }[];
};
