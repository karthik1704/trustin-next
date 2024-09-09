import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { dateFormatter, getLaterDate } from "@/lib/utils";

import { Data } from "@/app/dashboard/invoices/[id]/typings";
import Header from "./common/header";
import Footer from "./common/footer";
import CustomerDetails from "./common/customer-details";
import USDTamilInvoiceParameterTable from "./parameters/usd-parameters-table";
import USDTotalSection from "./total-sections/usd-total-section";
import USDExtraSection from "./common/usd-extra-section";

Font.register({
  family: "Cambria",
  fonts: [
    { src: "/cambria/Cambria-Bold.ttf" }, // font-style: normal, font-weight: normal
    { src: "/cambria/Cambria.ttf", fontWeight: 700 }, // font-style: normal, font-weight: normal
    { src: "/cambria/Cambria-Italic.ttf", fontStyle: "italic" },
    {
      src: "/cambria/Cambria-BoldItalic.ttf",
      fontStyle: "italic",
      fontWeight: 700,
    },
  ],
});
// Create styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Cambria",
    backgroundColor: "#FFFFFF",
    padding: 5,
    fontSize: "10px",
    position: "relative",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  section: {
    margin: 10,
    // marginTop: 0,
    padding: 10,
    flexGrow: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 50,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
  },
});

// Create Document Component
const USDInvoice: React.FC<{ invoiceData: Data }> = ({ invoiceData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Header lut_arn={invoiceData.invoice.lut_arn} />
        <View>
          <View
            style={{
              border: "1 solid #000",
              display: "flex",
              flexDirection: "row",
              fontWeight: "bold",
              fontSize: "10px",
              padding: 2,
            }}
            fixed
          >
            <Text
              style={{
                borderRight: "1 solid #000",
                width: 140,
                padding: 1,
                fontWeight: "medium",
              }}
            >
              Invoice No.
            </Text>
            <Text
              style={{
                borderRight: "1 solid #000",
                width: 140,
                padding: 2,
                marginLeft: 4,
              }}
            >
              {invoiceData.invoice.invoice_code}
            </Text>

            <Text
              style={{
                borderRight: "1 solid #000",
                width: 100,
                padding: 1,
                fontWeight: "medium",
              }}
            >
              Date
            </Text>
            <Text style={{ padding: 2, marginLeft: 4 }}>
              {dateFormatter(invoiceData.invoice.updated_at)}
            </Text>
          </View>

          <CustomerDetails invoiceData={invoiceData} />
          <USDTamilInvoiceParameterTable
            parameters={invoiceData.invoice.invoice_parameters}
            currency={invoiceData.invoice.currency}
            invoice_type={invoiceData.invoice.invoice_type}
            tested_type={invoiceData.invoice.tested_type}
            invoice={invoiceData.invoice}
          />
          <USDTotalSection invoice={invoiceData.invoice} />
          <USDExtraSection />
        </View>
        <Footer />
      </View>
    </Page>
  </Document>
);

export default USDInvoice;
