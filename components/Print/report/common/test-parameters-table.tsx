import { View, Text } from "@react-pdf/renderer";
import { SampleTestParameters } from "@/app/dashboard/samples/[id]/typings";
import { StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
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



const TestParameterTable = ({
    parameters,
    showStatus,
  }: {
    parameters: SampleTestParameters[];
    showStatus: boolean;
  }) => (
    <View>
      <View style={{ marginTop: 5, border: "1 solid #000", padding: 1 }} fixed>
        <Text
          style={{
            textAlign: "center",
            fontSize: 10,
            fontWeight: "medium",
            textTransform:"uppercase",
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
            { width: showStatus ? "30%" : "40%", fontSize: "10px" },
          ]}
        >
          Parameter Name
        </Text>
        {/* <Text style={[styles.cell, { width: "15%" }]}>Parameter Code</Text> */}
        <Text style={[styles.cell, { width: "25%" }]}>Method</Text>
        <View style={[styles.cell, { width: showStatus ? "35%" : "40%" }]}>
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
        {showStatus && (
          <Text style={[styles.cell, styles.lastCell, { width: "15%" }]}>
            Status
          </Text>
        )}
      </View>
  
      {/* First 3 Items */}
      {parameters.map((item, index) => (
        <View key={index} style={[styles.row, { fontSize: "10px" }]}>
          <Text
            style={[
              styles.cell,
              styles.firstCell,
              { width: showStatus ? "30%" : "40%", fontWeight: "bold" },
            ]}
          >
            {item.test_parameter.testing_parameters}
          </Text>
  
          <Text style={[styles.cell, { width: "25%", fontWeight: "bold", textAlign: "center" }]}>
            {item.test_parameter.method_or_spec}
          </Text>
          <View
            style={[
              styles.cell,
              {
                width: showStatus ? "35%" : "40%",
                flexDirection: "row",
                // alignItems: "stretch",
                alignItems: "center", // Center vertically
                justifyContent: "center",
                fontWeight: "bold",
                textAlign: "center",
              },
            ]}
          >
            {item.test_parameter.test_type_id === 1 ? (
              <Text style={{ textAlign: "center", width: "100%" }}>
                {" "}
                {item.specification_limits}{" "}
              </Text>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                  alignItems: "stretch",
                  textAlign: "center",
                }}
              >
                {item.specification_limits ? (
                  <Text style={{ textAlign: "center", width: "100%" }}>
                    {item.specification_limits}{" "}
                  </Text>
                ) : (
                  <>
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
                  </>
                )}
              </View>
            )}
          </View>
          <Text
            style={[
              styles.cell,
              { width: "20%", fontWeight: "bold", textAlign: "center" },
            ]}
          >
            {item.value ?? "Pending"}
          </Text>
          {showStatus && (
            <Text
              style={[
                styles.cell,
                styles.lastCell,
                { width: "15%", fontWeight: "bold", textAlign: "center" },
              ]}
            >
              {item.result ? "Passes" : "Failed"}
            </Text>
          )}
        </View>
      ))}
    </View>
  );

export default TestParameterTable;
