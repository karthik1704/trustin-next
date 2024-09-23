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
import { dateFormatter } from "@/lib/utils";

import { Data } from "@/app/dashboard/invoices/[id]/typings";
import Header from "../common/proforma-header";
import Footer from "../common/footer";
import CustomerDetails from "../common/customer-details";
import ExtraSection from "../common/proforma-extra-section";
import TamilInvoiceParameterTable from "../parameters/tamilnadu-parameters-table";
import TamilnaduTotalSection from "../total-sections/proforma/tamil-total-section";

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
    // padding: 5,
    fontSize: "10px",
    position: "relative",
    flexDirection: "column",
    justifyContent: "space-between",

    padding: 10,
  },
  section: {
    // margin: 10,
    // marginTop: 0,
    // padding: 10,
    // borderStyle: "solid",
    // borderWidth: 1,
    // borderColor: "#000",
    flexGrow: 1,
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

const TamilNaduInvoice: React.FC<{ invoiceData: Data }> = ({ invoiceData }) => {
  const { invoice } = invoiceData;
  const { invoice_parameters, sample_id_nos } = invoice;

  let parametersPerPage = 13; // Default value
  const getParametersPerPage = (parameters: any[]) => {

    if (sample_id_nos.length < 100) {
      parametersPerPage = 13;
    } else if (sample_id_nos.length < 200) {
      parametersPerPage = 9;
    } else {
      parametersPerPage = 7;
    }
    parameters.forEach((param) => {
      if (param.key === "test_parameter" && param.value.length > 17) {
        parametersPerPage -= 1; // Reduce by 1 if length of test_parameter is above 17
      }
      if (param.key === "test_parameter" && param.value.length > 28) {
        parametersPerPage -= 1; // Further reduce by 1 if length is above 28
      }
    });

    return Math.max(parametersPerPage, 1); // Ensure at least 1 parameter per page
  };

  // Split invoice_parameters into chunks for each page
  const parameterChunks = [];
  let currentParameters = [...invoice_parameters];
  while (currentParameters.length > 0) {
    const parametersPerPage = getParametersPerPage(currentParameters);
    parameterChunks.push(currentParameters.slice(0, parametersPerPage));
    currentParameters = currentParameters.slice(parametersPerPage);
  }

  return (
    <Document>
      {parameterChunks.length > 0 &&
        parameterChunks.map((chunk, index) => (
          <Page key={index} size="A4" style={styles.page}>
            <View style={styles.section}>
              <Header />
              <View>
                {/* Invoice header */}
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

                <CustomerDetails invoiceData={invoiceData} fixed />
                <View wrap={false}>
                  <TamilInvoiceParameterTable
                    parameters={chunk}
                    currency={invoiceData.invoice.currency}
                    invoice_type={invoiceData.invoice.invoice_type}
                    tested_type={invoiceData.invoice.tested_type}
                    invoice={invoiceData.invoice}
                    startingIndex={index * parametersPerPage}
                  />
                  {index === parameterChunks.length - 1 && (
                    <TamilnaduTotalSection invoice={invoiceData.invoice} />
                  )}
                </View>
                {index === parameterChunks.length - 1 && (
                  <View wrap={false}>
                    <ExtraSection
                      note={invoiceData.invoice.note}
                      authorized_sign_id={
                        invoiceData.invoice.authorized_sign_id
                      }
                    />
                  </View>
                )}
              </View>
              <Footer />
            </View>
          </Page>
        ))}
    </Document>
  );
};

export default TamilNaduInvoice;
