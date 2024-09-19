import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { Invoice } from "@/app/dashboard/invoices/[id]/typings";

const styles = StyleSheet.create({
  table: {
    display: "flex",
    flexDirection: "column",
    width: "auto",
    height: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    borderBottomStyle: "solid",
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    height: "100%",
  },
  tableCell: {
    // margin: "auto",
    marginTop: 5,
    fontSize: 10,
    textAlign: 'center',
    paddingVertical: 5,
    paddingHorizontal: 3,
  },
  tableHeader: {
    backgroundColor: "#FFFFFF",
    fontWeight: "medium",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    borderBottomStyle: "solid",
    fontSize: 8,
  },
});

type InvoiceParameter = {
  id: number;
  test_parameter: string;
  sac: string;
  testing_charge: number;
  no_of_tested: number;
  total_testing_charge: number;
};

interface InvoiceParameterTableProps {
  parameters: InvoiceParameter[];
  currency: string;
  invoice_type: string;
  tested_type: TestedTypeKey;
  invoice: Invoice;
  startingIndex: number;
}

const TestedType = {
  TESTED: "Tested",
  BATCHES: "Batches",
  PIECES: "Pieces",
  LOCATION: "Location",
} as const;
  type TestedTypeKey = keyof typeof TestedType;


const TamilInvoiceParameterTable: React.FC<InvoiceParameterTableProps> = ({
  parameters,
  currency,
  invoice_type,
  tested_type,
  invoice,
  startingIndex,
}: InvoiceParameterTableProps) => (
  <View style={styles.table} fixed>
    <View style={[styles.tableRow, styles.tableHeader]}>
      <View style={[styles.tableCol, { width: "6%" }]}>
        <Text style={styles.tableCell}>Sl.No</Text>
      </View>
      <View style={[styles.tableCol, { width: "30%" }]}>
        <Text style={styles.tableCell}>
          Description of Activity / test parameters
        </Text>
      </View>
      <View style={[styles.tableCol, { width: "15%" }]}>
        <Text style={styles.tableCell}>SAC</Text>
      </View>
      <View style={[styles.tableCol, { width: "15%" }]}>
        <Text style={styles.tableCell}>Testing Charge / Test(INR)</Text>
      </View>
      <View style={[styles.tableCol, { width: "15%" }]}>
        <Text style={styles.tableCell}>No. of {TestedType[tested_type]}</Text>
      </View>
      <View style={[styles.tableCol, { width: "19%" }]}>
        <Text style={styles.tableCell}>Total Charge({currency})</Text>
      </View>
    </View>

    {parameters.map((item, index) => (
      <View
        key={item.id}
        style={[styles.tableRow, { fontWeight: "bold", fontSize: 8 }]}
      >
        <View style={[styles.tableCol, { width: "6%" }]}>
          <Text style={styles.tableCell}>{index + startingIndex + 1}</Text>

        </View>
        <View style={[styles.tableCol, { width: "30%" }]}>
          <Text style={styles.tableCell}>{item.test_parameter}</Text>
        </View>
        <View style={[styles.tableCol, { width: "15%" }]}>
          <Text style={styles.tableCell}>{item.sac}</Text>
        </View>
        <View style={[styles.tableCol, { width: "15%" }]}>
          <Text style={[styles.tableCell, {textAlign: 'left'}]}>{item.testing_charge}</Text>
        </View>
        <View style={[styles.tableCol, { width: "15%" }]}>
          <Text style={styles.tableCell}>{item.no_of_tested}</Text>
        </View>
        <View style={[styles.tableCol, { width: "19%" }]}>
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>{item.total_testing_charge}</Text>
        </View>
      </View>
    ))}
  
  </View>
);

export default TamilInvoiceParameterTable;
