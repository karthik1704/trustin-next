/* eslint-disable jsx-a11y/alt-text */
import { Image, StyleSheet, Text, View } from "@react-pdf/renderer";
import { logo } from "@/app/constant";

const styles = StyleSheet.create({
  commonText: {
    fontWeight: "medium",
    textAlign: "center",
    fontSize: "8px",
    marginTop: "5px",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    borderBottom: "1px solid #000",
  },
  logoContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "25%",
    padding: 10,
  },
  logo: {
    width: "100px",
    height: "100px",
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 5,
    marginLeft: 20,
  },
  companyName: {
    fontSize: "12px",
  },
});

const Header = ({ lut_arn }: { lut_arn?: string }) => {
  return (
    <View style={styles.headerContainer} fixed>
      <View style={styles.logoContainer}>
        <Image src={logo} style={styles.logo} />
      </View>

      <View style={styles.textContainer}>
        <Text style={{ ...styles.commonText, ...styles.companyName }}>
          Trustin Analytical Solutions Pvt. Ltd.
        </Text>

        {[
          "R.K complex, First Floor, Plot No. 303/B, B-Block",
          "Thiruneermalai Road, Parvathypuram",
          "Chromepet, Chennai-600044",
          "Ph: 044-22731006; E-mail: customercare@trustingroup.com",
          "CIN: U74900TN2016PTC104478",
          "GSTIN: 33AAFCT6714N1Z1",
        ].map((text, index) => (
          <Text key={index} style={styles.commonText}>
            {text}
          </Text>
        ))}

        {lut_arn && (
          <Text style={styles.commonText}>
            LUT ARN: {lut_arn}
          </Text>
        )}

        <Text
          style={{
            ...styles.commonText,
            fontSize: "10px",
            textDecoration: "underline",
          }}
        >
         Proforma Invoice
        </Text>
      </View>
    </View>
  );
};

export default Header;
