/* eslint-disable jsx-a11y/alt-text */
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import {
  Data,
  SampleTestParameters,
} from "@/app/dashboard/samples/[id]/typings";
import { dateFormatter, getLaterDate } from "@/lib/utils";
import { StandardKey, standards } from "@/app/constant";
import SampleDetails from "./common/sample-details";
import AuthorizedSign from "./common/authorized_sign";
import TestParameterTable from "./common/test-parameters-table";
import Statements from "./common/statements";
// import Header from "./common/header";

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
Font.registerHyphenationCallback((word) => {
  return [word];
});
// Create styles
const styles = StyleSheet.create({
  PDFContainer: {
    width: "100%",
    height: "50vh", //As per your page layout
    fontSize: "16px",
  },
  page: {
    // flexDirection: "row",
    fontFamily: "Cambria",
    backgroundColor: "white",
    fontSize: "10px",
    position: "relative",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  section: {
    marginTop: 100,
    marginBottom: 70,
    marginHorizontal: 10,
    // marginTop: 0,
    padding: 5,
    flexGrow: 1,
    // borderStyle: "solid",
    // borderWidth: 1,
  },
});

// Create PDF component
const MyDocument = ({
  data,
  isDraft,
  qr,
  reportType = "Copy",
}: {
  data: Data;
  isDraft: boolean;
  qr: string;
  reportType: string;
}) => {
  console.log(data);
  console.log(qr);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          {/* <Header nabl_logo={data.sample.nabl_logo} /> */}
          <Text style={{textAlign:'right'}}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
            fixed
          />
          <View
            style={{
              border: "1 solid #000",
              display: "flex",
              flexDirection: "row",
              fontWeight: "bold",
              // fontSize: "10px",
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
              Sample ID No.
            </Text>
            <Text
              style={{
                borderRight: "1 solid #000",
                width: 140,
                padding: 2,
                marginLeft: 4,
              }}
            >
              {data.sample.sample_id}
            </Text>

            <Text
              style={{
                borderRight: "1 solid #000",
                width: 100,
                padding: 1,
                fontWeight: "medium",
              }}
            >
              ULR No.
            </Text>
            <Text style={{ padding: 2, marginLeft: 4, width: "28%" }}>
              {data.sample.ulr_no ?? "N/A"}
            </Text>
          </View>
          <View>
            <View
              style={{
                border: "1 solid #000",
                display: "flex",
                flexDirection: "row",
                fontWeight: "bold",
                // fontSize: "10px",
                padding: 2,
              }}
            >
              <Text
                style={{
                  borderRight: "1 solid #000",
                  width: 140,
                  padding: 1,
                  fontWeight: "medium",
                }}
              >
                Sample Received Date
              </Text>
              <Text
                style={{
                  borderRight: "1 solid #000",
                  width: 140,
                  padding: 2,
                  marginLeft: 4,
                }}
              >
                {dateFormatter(data.sample.registration.date_of_received)}
              </Text>

              <Text
                style={{
                  borderRight: "1 solid #000",
                  width: 100,
                  padding: 1,
                  fontWeight: "medium",
                }}
              >
                Discipline
              </Text>
              <Text style={{ padding: 2, marginLeft: 4, width: "28%" }}>
                {" "}
                {data.sample.discipline ?? "N/A"}
              </Text>
            </View>
            <View
              style={{
                border: "1 solid #000",
                display: "flex",
                flexDirection: "row",
                fontWeight: "bold",
                // fontSize: "10px",
                padding: 2,
              }}
            >
              <Text
                style={{
                  borderRight: "1 solid #000",
                  width: 140,
                  padding: 1,
                  fontWeight: "medium",
                }}
              >
                Analysis Start Date
              </Text>
              <Text
                style={{
                  borderRight: "1 solid #000",
                  width: 140,
                  padding: 1,
                  marginLeft: 4,
                }}
              >
                {data.sample.sample_detail.length == 2
                  ? getLaterDate(
                      data.sample.sample_detail[0].testing_start_date,
                      data.sample.sample_detail[1].testing_start_date,
                    )
                  : dateFormatter(
                      data.sample.sample_detail[0].testing_start_date,
                    )}
              </Text>

              {/* <Text
                style={{
                  borderRight: "1 solid #000",
                  width: 100,
                  padding: 1,
                }}
              >
                Group
              </Text>
              <Text style={{ padding: 2, marginLeft: 4, width: "28%" }}>
                {" "}
                {data.sample.group ?? "N/A"}
              </Text> */}
              <Text
                style={{
                  borderRight: "1 solid #000",
                  width: 100,
                  padding: 1,
                  fontWeight: "medium",
                }}
              >
                Test Report No.
              </Text>
              <Text style={{ padding: 2, marginLeft: 4, width: "28%" }}>
                {" "}
                {data.sample.report_no ?? "N/A"}
              </Text>
            </View>
            <View
              style={{
                border: "1 solid #000",
                display: "flex",
                flexDirection: "row",
                fontWeight: "bold",

                // fontSize: "10px",
                padding: 2,
              }}
            >
              <Text
                style={{
                  borderRight: "1 solid #000",
                  width: 140,
                  padding: 1,
                  fontWeight: "medium",
                }}
              >
                Analysis Completed Date
              </Text>
              <Text
                style={{
                  borderRight: "1 solid #000",
                  width: 140,
                  padding: 1,
                  marginLeft: 4,
                }}
              >
                {data.sample.sample_detail.length == 2
                  ? getLaterDate(
                      data.sample.sample_detail[0].testing_end_date,
                      data.sample.sample_detail[1].testing_end_date,
                    )
                  : dateFormatter(
                      data.sample.sample_detail[0].testing_end_date,
                    )}
              </Text>
              <Text
                style={{
                  borderRight: "1 solid #000",
                  width: 100,
                  padding: 1,
                  fontWeight: "medium",
                }}
              >
                Report Type.
              </Text>
              <Text style={{ padding: 2, marginLeft: 4 }}> {reportType}</Text>
            </View>
            <View
              style={{
                border: "1 solid #000",
                display: "flex",
                flexDirection: "row",
                fontWeight: "bold",
                // fontSize: "10px",
                padding: 2,
              }}
            >
              <Text
                style={{
                  borderRight: "1 solid #000",
                  width: 140,
                  padding: 1,
                  fontWeight: "medium",
                }}
              >
                Report Date
              </Text>
              <Text
                style={{
                  borderRight: "1 solid #000",
                  width: 140,
                  padding: 1,
                  marginLeft: 4,
                }}
              >
                {dateFormatter(data.sample.updated_at)}
              </Text>

              <Text
                style={{
                  borderRight: "1 solid #000",
                  width: 100,
                  padding: 1,
                  fontWeight: "medium",
                }}
              >
                Customer Ref No.
              </Text>
              <Text style={{ padding: 1, marginLeft: 4 }}>
                {data.sample.registration.customer_reference_no ?? "---"}
              </Text>
            </View>

            {/* <View
              style={{
                border: "1 solid #000",
                display: "flex",
                flexDirection: "row",
                fontWeight: "bold",
                // fontSize: "10px",
                padding: 2,
              }}
            >
              
            </View> */}
            <View
              style={{
                border: "1 solid #000",
                display: "flex",
                flexDirection: "row",
                fontWeight: "bold",
                // fontSize: "10px",
                padding: 2,
              }}
            >
              <Text
                style={{
                  borderRight: "1 solid #000",
                  width: 140,
                  padding: 1,
                  fontWeight: "medium",
                }}
              >
                Name of the customer
              </Text>
              <Text style={{ padding: 1, marginLeft: 4 }}>
                {data.sample.registration.company_name}
              </Text>
            </View>
            <View
              style={{
                border: "1 solid #000",
                display: "flex",
                flexDirection: "row",
                fontWeight: "bold",
                // fontSize: "10px",
                padding: 2,
              }}
            >
              <Text
                style={{
                  borderRight: "1 solid #000",
                  width: 140,
                  padding: 1,
                  fontWeight: "medium",
                }}
              >
                Address
              </Text>
              <Text style={{ padding: 1, width: "65%", marginLeft: 4 }}>
                {data.sample.registration.full_address}
              </Text>
            </View>
            <View
              style={{
                border: "1 solid #000",
                display: "flex",
                flexDirection: "row",
                fontWeight: "bold",
                // fontSize: "10px",
                padding: 2,
              }}
            >
              <Text
                style={{
                  borderRight: "1 solid #000",
                  width: 140,
                  padding: 1,
                  fontWeight: "medium",
                }}
              >
                Manufacturing License No.
              </Text>
              <Text style={{ padding: 1, marginLeft: 4 }}>
                {data.sample.registration.license_no ?? "---"}
              </Text>
            </View>
            <View
              style={{
                border: "1 solid #000",
                display: "flex",
                flexDirection: "row",
                fontWeight: "bold",
                // fontSize: "10px",
                padding: 2,
              }}
            >
              <Text
                style={{
                  borderRight: "1 solid #000",
                  width: 140,
                  padding: 1,
                  fontWeight: "medium",
                }}
              >
                Contact Person Name
              </Text>
              <Text
                style={{
                  borderRight: "1 solid #000",
                  width: 140,
                  padding: 1,
                  marginLeft: 4,
                }}
              >
                {data.sample.registration.contact_person_name}
              </Text>

              <Text
                style={{
                  borderRight: "1 solid #000",
                  width: 100,
                  padding: 1,
                  fontWeight: "medium",
                }}
              >
                Contact Number
              </Text>
              <Text style={{ padding: 2, marginLeft: 4 }}>
                {data.sample.registration.contact_number}
              </Text>
            </View>
          </View>
          <SampleDetails data={data} fixed />
          <View
            style={{
              marginTop: 5,
              display: "flex",
              justifyContent: "flex-end",
              flexDirection: "column",
            }}
          ></View>
          <TestParameterTable
            parameters={data.sample?.sample_test_parameters?.slice(0, 3)}
            showStatus={data.sample?.show_status_report}
          />

          <AuthorizedSign
            sample_detail={data.sample.sample_detail}
            marginTop={5}
          />

          <View break />
          {/* <Footer /> */}
        </View>
      </Page>
      {!!data?.sample.sample_test_parameters.slice(3).length && (
        <Page style={styles.page}>
          <View style={styles.section}>
          <Text style={{textAlign:'right'}}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
            fixed
          />
            {/* <Header nabl_logo={data.sample.nabl_logo} /> */}
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
                }}
              >
                Sample ID No.
              </Text>
              <Text
                style={{
                  borderRight: "1 solid #000",
                  width: 140,
                  padding: 2,
                  marginLeft: 4,
                }}
              >
                {data.sample.sample_id}
              </Text>

              <Text
                style={{
                  borderRight: "1 solid #000",
                  width: 100,
                  padding: 1,
                }}
              >
                ULR No.
              </Text>
              <Text style={{ padding: 2, marginLeft: 4, width: "28%" }}>
                {data.sample.ulr_no ?? "N/A"}
              </Text>
            </View>

            {/* <SampleDetails data={data} /> */}
            <View
              style={{
                marginTop: 5,
                display: "flex",
                justifyContent: "flex-end",
                flexDirection: "column",
              }}
            ></View>
            <TestParameterTable
              parameters={data.sample?.sample_test_parameters?.slice(3)}
              showStatus={data.sample?.show_status_report}
            />

            <AuthorizedSign sample_detail={data.sample.sample_detail} />
            {/* <Footer /> */}
          </View>
        </Page>
      )}
      <Page style={styles.page}>
        <View style={styles.section}>
        <Text style={{textAlign:'right'}}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
            fixed
          />
          {/* <Header nabl_logo={data.sample.nabl_logo} /> */}
          <Statements data={data.sample} isDraft={isDraft} />
          

          <AuthorizedSign sample_detail={data.sample.sample_detail} qr={qr}/>

          {/* <Footer /> */}
        </View>
      </Page>
    </Document>
  );
};

export default MyDocument;
