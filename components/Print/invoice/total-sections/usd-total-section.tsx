import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { Invoice } from "../../../../app/dashboard/invoices/[id]/typings";
import {ToWords} from "to-words";
const styles = StyleSheet.create({
  tableRow: {
    flexDirection: "row",
    border: "1px solid #000000",
    borderTop: 0,
    alignItems: "center",
    height: 24,
    fontWeight: "medium",
  },
  tableCell: {
    fontSize: 8,
    padding: 4,
    fontWeight: "medium",
  },
});

interface TotalSectionProps {
  invoice: Invoice;
}
const toWords = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: {
      // can be used to override defaults for the selected locale
      name: 'Dollar',
      plural: 'Dollars',
      symbol: '$',
      fractionalUnit: {
        name: 'Cent',
        plural: 'Cents',
        symbol: '',
      },
    },
  },
});  
const USDTotalSection: React.FC<TotalSectionProps> = ({ invoice }) => {
  const { currency } = invoice;
  return (
    <View>
     {/*{/* <View style={styles.tableRow}>
         <Text
          style={[
            styles.tableCell,
            { width: "81%", textAlign: "right", borderRightWidth: 1 },
          ]}
        >
          Sub Total ({currency})
        </Text>
        <Text style={[styles.tableCell, { width: "19%", textAlign: "center" }]}>
          {invoice.sub_total}
        </Text>
      </View>
      <View style={styles.tableRow}>
        <Text
          style={[
            styles.tableCell,
            { width: "81%", textAlign: "right", borderRightWidth: 1 },
          ]}
        >
          Discount ({currency})
        </Text>
        <Text style={[styles.tableCell, { width: "19%", textAlign: "center" }]}>
          {invoice.discount}
        </Text>
      </View> */}
    
      <View style={styles.tableRow}>
        <Text
          style={[
            styles.tableCell,
            { width: "81%", textAlign: "right", borderRightWidth: 1 },
          ]}
        >
           Total ( {currency})
        </Text>
        <Text style={[styles.tableCell, { width: "19%", textAlign: "center" }]}>
          {invoice.grand_total}
        </Text>
      </View>
      <View style={styles.tableRow}>
        <Text
          style={[
            styles.tableCell,
            { width: "100%", textAlign: "left", borderRightWidth: 0 },
          ]}
        >
          Grand Total in Words: {toWords.convert(invoice.grand_total, { currency: true })}
        </Text>
      </View>
      <View style={styles.tableRow}>
        <Text
          style={[
            styles.tableCell,
            { width: "100%", textAlign: "left", borderRightWidth: 0 },
          ]}
        >
          &quot;Supply meant for export under LUT without payment of IGST&quot;.
        </Text>
      </View>
    </View>
  );
};

export default USDTotalSection;
