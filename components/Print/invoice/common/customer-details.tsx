import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    border: '1 solid #000',
    padding: 2,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 10,
    fontWeight: 'medium',
  },
  row: {
    border: '1 solid #000',
    display: 'flex',
    flexDirection: 'row',
    fontWeight: 'bold',
    fontSize: 10,
    padding: 2,
  },
  label: {
    borderRight: '1 solid #000',
    width: 140,
    padding: 1,
  },
  value: {
    padding: 1,
    width: '65%',
    marginLeft: 4,
  },
  emailContainer: {
    border: '1 solid #000',
    borderBottom: 'none',
    display: 'flex',
    flexDirection: 'row',
    fontWeight: 'bold',
    fontSize: 10,
    width: '100%',
  },
});

interface CustomerDetailsProps {
  invoiceData: {
    invoice: {
      customer: {
        company_name: string;
      };
      customer_address: string;
      customer_email: string;
      customer_gst: string;
      customer_ref_no: string;
      sample_id_nos: string;
      quotation_ref_no: string;
      contact_person_name: string;
      contact_phone: string;
    };
  };
  fixed?: boolean;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({ invoiceData, fixed=false }) => {
  return (
    <View fixed> 
      <View style={styles.container}>
        <Text style={styles.headerText}>Customer Details</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Customer Name</Text>
        <Text style={styles.value}>{invoiceData.invoice.customer.company_name}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Contact Person Name</Text>
        <Text style={styles.value}>{invoiceData.invoice.contact_person_name}</Text>
      </View>
      {/* <View style={styles.row}>
        <Text style={styles.label}>Phone Number</Text>
        <Text style={styles.value}>{invoiceData.invoice.contact_phone}</Text>
      </View> */}
      <View style={[styles.row, {paddingHorizontal:0, paddingBottom:0}]}>
        <Text style={[styles.label, {width:152}]}>Customer Address</Text>
        <View style={{ display: 'flex', flexDirection: 'column' }}>
          <Text style={[styles.value, {paddingHorizontal:2}]}>{invoiceData.invoice.customer_address}</Text>
          <View style={styles.emailContainer}>
            <View style={{width:120, borderRight:'1px solid #000'}}><Text style={{marginLeft:3}}>Ph: {invoiceData.invoice.contact_phone}</Text></View>
            <Text style={{ width: '60%', padding: 1 }}>
              Email-Id: {invoiceData.invoice.customer_email}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Customer GST Number</Text>
        <Text style={styles.value}>{invoiceData.invoice.customer_gst}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Customer Ref No.</Text>
        <Text style={styles.value}>{invoiceData.invoice.customer_ref_no}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Sample ID No(s)</Text>
        <Text style={styles.value}>{invoiceData.invoice.sample_id_nos}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Our quotation Ref. No.</Text>
        <Text style={styles.value}>{invoiceData.invoice.quotation_ref_no}</Text>
      </View>
    </View>
  );
};

export default CustomerDetails;
