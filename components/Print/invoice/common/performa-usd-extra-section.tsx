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

const USDExtraSection = ({ note, authorized_sign_id }: { note?: string, authorized_sign_id: number|null }) => {
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
        style={{ textAlign: "right", justifyContent: "flex-end", marginTop: 3 }}
      >
        <Text>For Trustin Analytical Solutions Pvt. Ltd</Text>
        {authorized_sign_id && <Image src={SIGN_IMAGES[authorized_sign_id]} style={{width: 100, height: 100}} />}
        </View>
      <View style={{ marginTop: 80, marginBottom: 20 }}>
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
          1. 100% payment against Performa Invoice.
        </Text>
        <Text style={{ fontSize: 8, marginLeft: 2, marginVertical: 5 }}>
          2. Wire Transfer should be drawn in favour of &quot;TRUSTIN ANALYTICAL
          SOLUTIONS PVT LTD&quot; payable at Chennai.
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
          <Text style={styles.label}>SWIFT Code</Text>
          <Text style={styles.value}>IDIBINBBTSY</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>AD Code</Text>
          <Text style={styles.value}>0260106</Text>
        </View>
      </View>
    </View>
  );
};

export default USDExtraSection;
