import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { Invoice } from "../../../../../app/dashboard/invoices/[id]/typings";
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

const toWords = new ToWords();
const ExemptedTotalSection: React.FC<TotalSectionProps> = ({ invoice }) => {
  const { currency } = invoice;
  return (
    <View>
      <View style={styles.tableRow}>
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
      {invoice.discount >0 && (
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
        </View>
      )}
      <View style={styles.tableRow}>
        <Text
          style={[
            styles.tableCell,
            { width: "81%", textAlign: "right", borderRightWidth: 1 },
          ]}
        >
          Grand Total (in {currency})
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
          Grand Total (in Words): {toWords.convert(invoice.grand_total, { currency: true })}
        </Text>
      </View>
    </View>
  );
};

export default ExemptedTotalSection;
