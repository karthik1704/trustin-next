import { standards } from "@/app/constant";
import { Sample } from "@/app/dashboard/samples/[id]/typings";
import { View, Text } from "@react-pdf/renderer";

const Statements = ({ data, isDraft }: { data: Sample; isDraft: boolean }) => {
  return (
    <View>
      <View
        style={{
          display: "flex",
          fontSize: 12,
          padding: 2,
          marginTop: "16px",
          fontWeight: "bold",
        }}
      >
        <Text style={{ fontWeight: "medium", textAlign: "left" }}>
          Statement of confirmity:
        </Text>
        <Text style={{ marginLeft: 20, textAlign: "left", fontSize: 10 }}>
          {data.statement_of_conformity
            ? data.statement_of_conformity
            : "The Submitted sample passes as per above Test Method / Specifications with respect to the above test only."}
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
          style={{ fontWeight: "bold", textAlign: "left", fontSize: "7px" }}
        >
          <Text style={{ textDecoration: "underline", fontWeight: "medium" }}>
            Abbrevations:
          </Text>{" "}
          {data.abbreviations && data.abbreviations.length
            ? data.abbreviations
                .map(
                  (abbreviation) =>
                    ` ${abbreviation}: ${standards[abbreviation]}`,
                )
                .join(", ")
            : ""}
        </Text>

        <View
          style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "column",
            fontSize: 8,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              textAlign: "left",
              paddingVertical: 2,
            }}
          >
            Note : 1. No external service provider used in this report, 2. No
            additions, deviations or exclusions from the test method, 3. For
            Terms and Conditions, please refer our website -
            www.trustingroup.in.
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
            * The test results in this report refer only to the sample tested in
            the laboratory and the sample submitted by the party. *
          </Text>
          {!!data.reason && (
            <Text
              style={{
                fontWeight: "bold",
                textAlign: "center",
                paddingVertical: 2,
              }}
            >
              * {data.reason} *
            </Text>
          )}
          <Text
            style={{
              fontWeight: "bold",
              textAlign: "center",
              paddingVertical: 2,
            }}
          >
            NABL Accredited Laboratory vide cert. No: TC-5410 valid upto
            30/03/2026, CDSCO Registration No: TL/MD/2020/000002
          </Text>
          {isDraft && (
            <Text style={{ fontWeight: "bold", textAlign: "center" }}>
              * This is Draft report, you can&apos;t use this for certification
              purpose. *
            </Text>
          )}
        </View>
        <Text
          style={{
            fontSize: 10,
            fontWeight: "medium",
            textAlign: "center",
            marginTop: 4,
          }}
        >
          ...End of Report...
        </Text>
      </View>
    </View>
  );
};

export default Statements;
