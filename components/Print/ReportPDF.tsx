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
  SampleDetailSchema,
  SampleTestParameters,
} from "@/app/dashboard/samples/[id]/typings";
import { dateFormatter, getLaterDate } from "@/lib/utils";

// import CambriaBold from '';
const SIGN_IMAGES: { [key: string]: string } = {
  "24": "/images/signs/mahendren.png",
  "25": "/images/signs/senthil-kumar.png",
  "16": "/images/signs/vasantha.png",
  "14": "/images/signs/tamil vannan.png",
  "15": "/images/signs/sabari.png",
  "30": "/images/signs/dhanraj.png",
};

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
    margin: 10,
    // marginTop: 0,
    padding: 5,
    flexGrow: 1,
    borderStyle: "solid",
    borderWidth: 1,
  },
  table: {
    display: "flex",
    borderStyle: "solid",
    borderWidth: 1,
    justifyContent: "flex-start",
  },
  tableRow: { margin: "auto", flexDirection: "row" },
  tableCell: {
    fontSize: 10,
    padding: 5,
    borderStyle: "solid",
    borderWidth: 1,
  },
  tableHeader: {
    fontSize: 8,
    padding: 5,
    borderStyle: "solid",
    borderWidth: 1,
  },
  row: { flexDirection: "row", fontSize: "12px" },
  cell: {
    padding: 3,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    borderRightWidth: 1,
    borderRightColor: "#000000",
  },
  firstCell: { borderLeftWidth: 1, borderLeftColor: "#000000" },
  lastCell: { borderRightWidth: 1 },
  tableBody: { marginTop: 10, borderTopWidth: 1, borderTopColor: "#000000" },
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
          <Header nabl_logo={data.sample.nabl_logo} />

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
                }}
              >
                Discipline
              </Text>
              <Text style={{ padding: 2, marginLeft: 4, width: "28%" }}>
                {" "}
                {data.sample.disicipline ?? "N/A"}
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

              <Text
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
                }}
              >
                Customer Ref No.
              </Text>
              <Text style={{ padding: 1, marginLeft: 4 }}>
                {data.sample.registration.customer_reference_no ?? "---"}
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
          />

          <AuthorizedSign
            sample_detail={data.sample.sample_detail}
            marginTop={5}
            height={30}
          />

          <View break />
          <Footer />
        </View>
      </Page>
      {!!data?.sample.sample_test_parameters.slice(3).length && (
        <Page style={{ fontFamily: "Cambria" }}>
          <View style={styles.section}>
            <Header nabl_logo={data.sample.nabl_logo} />
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

            <SampleDetails data={data} />
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
            />

            <AuthorizedSign sample_detail={data.sample.sample_detail} />
            <Footer />
          </View>
        </Page>
      )}
      <Page style={{ fontFamily: "Cambria" }}>
        <View style={styles.section}>
          <Header nabl_logo={data.sample.nabl_logo} />
          <View
            style={{
              display: "flex",
              fontSize: 12,
              padding: 2,
              marginTop: "16px",
            }}
          >
            <Text style={{ fontWeight: "bold", textAlign: "left" }}>
              Statement of confirmity:
            </Text>
            <Text style={{ marginLeft: 20, textAlign: "left", fontSize: 10 }}>
              The Submitted sample passed as per abouve Test Method /
              Specifications with respect to the above test only.
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              fontSize: 10,
              padding: 2,
            }}
          >
            <Text
              style={{ fontWeight: "thin", textAlign: "left", fontSize: "7px" }}
            >
              <Text style={{ textDecoration: "underline", fontWeight: "bold" }}>
                Abbrevations:
              </Text>{" "}
              The Submitted sample passed as per abouve Test Method /
              Specifications with respect to the above test only.
            </Text>
          </View>

          <AuthorizedSign sample_detail={data.sample.sample_detail} />
          <View
            style={{
              marginTop: 90,
              display: "flex",
              flexDirection: "column",
              fontSize: 10,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                textAlign: "left",
                paddingVertical: 2,
              }}
            >
              Note : 1. No external service provider used in this report
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                textAlign: "left",
                textIndent: 30,
                paddingVertical: 2,
              }}
            >
              2. No additions, deviations or exclusions from the tesrmethod.
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                textAlign: "center",
                paddingVertical: 2,
              }}
            >
              {" "}
              * This test report shall not be reproduced except in full, without
              written approval of the laboratory. *
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                textAlign: "center",
                paddingVertical: 2,
              }}
            >
              * The test results in this report refer only to the sample tested
              in the laboratory and the sample submitted by the party. *
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                textAlign: "center",
                paddingVertical: 2,
              }}
            >
              NABL Accredited Laboratory vide cert. No: TC-5410 valid upto
              30/03/2026, CDSCO Registration No: TLIMD/2020/000002
            </Text>
            {isDraft && (
              <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                * This is Draft report, you can&apos;t use this for
                certification purpose. *
              </Text>
            )}
          </View>
          <View style={{ height: "200px" }}>
            <Image src={qr} style={{ width: 100, height: 100 }} />
          </View>
          <Footer />
        </View>
      </Page>
    </Document>
  );
};

const TestParameterTable = ({
  parameters,
}: {
  parameters: SampleTestParameters[];
}) => (
  <View>
    <View style={{ marginTop: 5, border: "1 solid #000", padding: 1 }} fixed>
      <Text
        style={{
          textAlign: "center",
          fontSize: 10,
          fontWeight: "medium",
        }}
      >
        Test Result
      </Text>
    </View>
    <View
      style={[
        styles.row,
        styles.tableBody,
        { fontSize: "10px", textAlign: "center" },
      ]}
      fixed
    >
      <Text
        style={[
          styles.cell,
          styles.firstCell,
          { width: "30%", fontSize: "10px" },
        ]}
      >
        Parameter Name
      </Text>
      {/* <Text style={[styles.cell, { width: "15%" }]}>Parameter Code</Text> */}
      <Text style={[styles.cell, { width: "25%" }]}>Method</Text>
      <View style={[styles.cell, { width: "35%" }]}>
        <Text style={{ paddingBottom: 1 }}>Specification Limits</Text>
        <View style={{ flexDirection: "row", textAlign: "center" }}>
          <Text
            style={{
              width: "50%",
              borderRightWidth: "1px",
              borderRightColor: "#000",
            }}
          >
            Min
          </Text>
          <Text style={{ width: "50%" }}>Max</Text>
        </View>
      </View>
      <Text style={[styles.cell, { width: "20%" }]}>Result Obtained</Text>
      <Text style={[styles.cell, styles.lastCell, { width: "15%" }]}>
        Status
      </Text>
    </View>

    {/* First 3 Items */}
    {parameters.map((item, index) => (
      <View key={index} style={[styles.row, { fontSize: "10px" }]}>
        <Text
          style={[
            styles.cell,
            styles.firstCell,
            { width: "30%", fontWeight: "bold" },
          ]}
        >
          {item.test_parameter.testing_parameters}
        </Text>

        <Text style={[styles.cell, { width: "25%", fontWeight: "bold" }]}>
          {item.test_parameter.method_or_spec}
        </Text>
        <View
          style={[
            styles.cell,
            {
              width: "35%",
              flexDirection: "row",
              alignItems: "stretch",
              fontWeight: "bold",
            },
          ]}
        >
          {item.test_parameter.test_type_id === 1 ? (
            <Text> {item.specification_limits} </Text>
          ) : (
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                alignItems: "stretch",
              }}
            >
              <Text
                style={{
                  width: "50%",
                  borderRightWidth: "1px",
                  borderRightColor: "#000",
                  height: "100%",
                  alignSelf: "stretch",
                  lineHeight: "auto",
                }}
              >
                {" "}
                {item.min_limits}{" "}
              </Text>
              <Text
                style={{
                  width: "50%",
                }}
              >
                {" "}
                {item.max_limits}{" "}
              </Text>
            </View>
          )}
        </View>
        <Text style={[styles.cell, { width: "20%", fontWeight: "bold" }]}>
          {item.value ?? "Pending"}
        </Text>
        <Text
          style={[
            styles.cell,
            styles.lastCell,
            { width: "15%", fontWeight: "bold" },
          ]}
        >
          {item.result ? "Pass" : "Fail"}
        </Text>
      </View>
    ))}
  </View>
);

const SampleDetails = ({
  data,
  fixed = false,
}: {
  data: Data;
  fixed?: boolean;
}) => (
  <View fixed>
    <View style={{ marginTop: 5, border: "1 solid #000", padding: 2 }}>
      <Text
        style={{
          textAlign: "center",
          // fontSize: "10px",
          fontWeight: "medium",
        }}
      >
        Sample Details
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
          padding: 2,
        }}
      >
        Sample Name
      </Text>
      <Text
        style={{
          borderRight: "1 solid #000",
          width: 140,
          padding: 2,
          marginLeft: 4,
        }}
      >
        {data.sample.sample_name}
      </Text>

      <Text
        style={{
          borderRight: "1 solid #000",
          width: 100,
          padding: 2,
        }}
      >
        Test Method / Specification
      </Text>
      <Text style={{ padding: 2, marginLeft: 4 }}>
        {data.sample.sample_detail.length === 2
          ? "Micro, Mech"
          : data.sample.sample_detail[0].test_type_id === 1
            ? "Micro"
            : "Mech"}
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
          padding: 2,
        }}
      >
        Batch No.
      </Text>
      <Text
        style={{
          borderRight: "1 solid #000",
          width: 140,
          padding: 2,
          marginLeft: 4,
        }}
      >
        {data.sample.batch_or_lot_no}
      </Text>
      <Text
        style={{
          borderRight: "1 solid #000",
          width: 100,
          padding: 2,
        }}
      >
        Mfg Date
      </Text>
      <Text style={{ padding: 2, marginLeft: 4 }}>
        {data.sample.manufactured_date}
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
          padding: 2,
        }}
      >
        Batch Size
      </Text>
      <Text
        style={{
          padding: 2,
          borderRight: "1 solid #000",
          width: 140,
          marginLeft: 4,
        }}
      >
        {data.sample.batch_size}
      </Text>

      <Text
        style={{
          borderRight: "1 solid #000",
          width: 100,
          padding: 2,
        }}
      >
        Exp Date
      </Text>
      <Text style={{ padding: 2, marginLeft: 4 }}>
        {" "}
        {data.sample.expiry_date}
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
          padding: 2,
        }}
      >
        Manufactured by
      </Text>
      <Text
        style={{
          padding: 2,
          borderRight: "1 solid #000",
          width: 140,
          marginLeft: 4,
        }}
      >
        {data.sample.registration.manufactured_by ?? "N/A"}
      </Text>

      <Text
        style={{
          borderRight: "1 solid #000",
          width: 100,
          padding: 2,
        }}
      >
        Sampled By
      </Text>
      <Text style={{ padding: 2, marginLeft: 4 }}>
        {" "}
        {data.sample.registration.sampled_by}
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
          padding: 2,
        }}
      >
        Description
      </Text>
      <Text style={{ padding: 2, width: "65%", marginLeft: 4 }}>
        {data.sample.description}
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
          padding: 2,
        }}
      >
        Quantity Received
      </Text>
      <Text style={{ padding: 2, marginLeft: 4 }}>
        {data.sample.received_quantity ?? "---"}
      </Text>
    </View>
   
    {/* <View
                style={{
                  border: "1 solid #000",
                  display: "flex",
                  flexDirection: "row",
                  fontWeight: "bold",
                  fontSize: "10px",
                  padding: 2,
                }}
              >
                <Text
                  style={{
                    borderRight: "1 solid #000",
                    width: 140,
                    padding: 2,
                  }}
                >
                  Product Name
                </Text>
                <Text style={{ padding: 2, marginLeft: 4 }}>
                  {data?.sample?.registration?.product_data?.product_name}
                </Text>
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
          padding: 2,
        }}
      >
        Additional details
      </Text>
      <Text style={{ padding: 2, marginLeft: 4 }}>
        {data?.sample?.additional_detail ?? "N/A"}
      </Text>
    </View>
  </View>
);

const AuthorizedSign = ({
  sample_detail,
  marginTop = 100,
  height = 50,
}: {
  sample_detail: SampleDetailSchema[];
  marginTop?: number;
  height?: number;
}) => (
  <View
    style={{
      marginTop: marginTop,
      display: "flex",
      justifyContent: "flex-end",
      flexDirection: "column",
      fontSize: 14,
    }}
    fixed
  >
    <View
      style={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row-reverse",
      }}
    >
      {sample_detail.map((detail) => (
        <View
          key={detail.id}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center", // Center items horizontally
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              textAlign: "center", // Center text
              marginBottom: "8px",
            }}
          >
            Authorized Signatory
          </Text>
          {detail.authorized_sign && (
            <Image
              src={
                SIGN_IMAGES[detail.authorized_sign.id.toString()] ??
                "/images/signs/vasantha.png"
              }
              style={{ width: 150, height: height }}
            />
          )}
          <Text
            style={{
              fontWeight: "bold",
              textAlign: "center", // Center text
              marginBottom: "8px",
              fontSize: "10px",
            }}
          >
            {detail.authorized_sign
              ? `${detail.authorized_sign.first_name} ${detail.authorized_sign.last_name}`
              : ""}
          </Text>
          <Text
            style={{
              fontWeight: "bold",
              textAlign: "center", // Center text
              fontSize: "8px",
            }}
          >
            {detail.authorized_sign
              ? `${detail.authorized_sign.designation ?? ""} `
              : ""}
          </Text>
        </View>
      ))}
    </View>
  </View>
);

const Header = ({ nabl_logo }: { nabl_logo: boolean }) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #000",
      }}
      fixed
    >
      <View
        style={{
          width: nabl_logo ? 150 : 0, // Maintain space if nabl_logo is visible or not
          height: 80,
        }}
      >
        {nabl_logo && (
          <Image
            src="/images/pdf/nabl_logo.png"
            style={{ width: 150, height: 80 }}
          />
        )}
      </View>

      <View
        style={{
          flex: 1,
          textAlign: "center",
          justifyContent: "center", // Ensure the text is vertically centered
        }}
      >
        <Text
          style={{
            fontWeight: "medium",
            fontSize: "12px",
            marginTop: "5px",
          }}
        >
          TEST REPORT
        </Text>
      </View>

      <View
        style={{
          width: 150, // Keep the same width as the logo for symmetry
          height: 80,
        }}
      >
        {/* <Image src="/images/logo/logo.png" style={{ width: 120, height: 80 }} /> */}
      </View>
    </View>
  );
};

const Footer = () => {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 3,
        left: 0,
        right: 0,
        padding: 1,
      }}
      fixed
    >
      <View style={{ display: "flex", marginBottom: "3px" }}>
        <View style={{ border: "1 solid #000" }}></View>
        <View style={{ border: "1 solid #000" }}></View>
        <View style={{ textAlign: "center", padding: 1 }}>
          <Text
            style={{
              fontSize: "8px",
              fontWeight: "medium",
              padding: 2,
            }}
          >
            Trustin Analytical Solutions Private Limited
          </Text>
          <Text style={{ fontSize: "6px", fontWeight: "normal", padding: 1 }}>
            {" "}
            (An ISO 17025:2017 Accredited / CDSCO & BIS APProved Testing
            Laboratory)
          </Text>
          <Text style={{ fontSize: "6px", fontWeight: "medium", padding: 1 }}>
            {" "}
            R.K Complex First Floor, Plot No.303/B, B-Block, Thiruneermalai
            Road,
          </Text>
          <Text style={{ fontSize: "6px", fontWeight: "medium", padding: 1 }}>
            {" "}
            Parvathy Puram, Chrompet, Chennai-600044, Tamilnadu, India.
          </Text>
          <Text style={{ fontSize: "6px", fontWeight: "medium", padding: 1 }}>
            Ph: 044-22731006, Email: customercare@trustingroup.in,
            web:www.trustingroup.in
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MyDocument;
