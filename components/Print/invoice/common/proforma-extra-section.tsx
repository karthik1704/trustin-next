/* eslint-disable jsx-a11y/alt-text */
import { View, Text, Image } from "@react-pdf/renderer";

import { StyleSheet } from "@react-pdf/renderer";
import { SIGN_IMAGES } from "./signs";

const styles = StyleSheet.create({
  row: {
    display: "flex",
    flexDirection: "row",
    fontWeight: "medium",
    fontSize: 10,
    padding: 2,
  },
  label: {
    width: 140,
    padding: 1,
  },
  value: {
    padding: 1,
    width: "65%",
    marginLeft: 4,
  },
});

const ExtraSection = ({ note, authorized_sign_id }: { note?: string, authorized_sign_id: number|null }) => {
  return (
    <View>
      {note && (
        <View
          style={{
            textAlign: "left",
            justifyContent: "flex-start",
            marginTop: 3,
          }}
        >
          <Text>{note}</Text>
        </View>
      )}
      <View
        style={{ marginTop: 3 }}
      >
        <Text style={{ textAlign: "right" }}>For Trustin Analytical Solutions Pvt. Ltd</Text>
        {/* <Text>{authorized_sign_id}</Text> */}
        {authorized_sign_id && (
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
            <Image src={SIGN_IMAGES[authorized_sign_id] ?? SIGN_IMAGES[24]} style={{width: 150, height: 50}} />
          </View>
        )}
      </View>
      <View style={{ marginTop: 20, marginBottom: 10 }}>
        <Text
          style={{
            fontSize: 8,
            fontWeight: "medium",
            textDecoration: "underline",
            paddingVertical: 2,
          }}
        >
          Payment Terms & Conditions:
        </Text>
        <Text style={{ fontSize: 8, marginLeft: 2, marginVertical: 5 }}>
          1. 100% payment against Proforma Invoice.
        </Text>
        <Text style={{ fontSize: 8, marginLeft: 2, marginVertical: 5 }}>
          2. Cheque / Demand Draft should be drawn in favour of &quot;TRUSTIN
          ANALYTICAL SOLUTIONS PVT LTD&quot; payable at Chennai.
        </Text>
      </View>
      <View>
        <View style={styles.row}>
          <Text style={styles.label}>Account No.:</Text>
          <Text style={styles.value}>7519925451</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Bank Name & Branch </Text>
          <Text style={styles.value}>Indian Bank & East Tambaram Branch</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>IFSC Code</Text>
          <Text style={styles.value}>IDIB000T004</Text>
        </View>
      </View>
    </View>
  );
};

export default ExtraSection;
