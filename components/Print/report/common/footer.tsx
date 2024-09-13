import { View, Text } from "@react-pdf/renderer";

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
            Road, Parvathy Puram, Chrompet, Chennai-600044, Tamilnadu, India.
          </Text>
          {/* <Text style={{ fontSize: "6px", fontWeight: "medium", padding: 1 }}>
              {" "}
              
            </Text> */}
          <Text style={{ fontSize: "6px", fontWeight: "medium", padding: 1 }}>
            Ph: 044-22731006, Email: customercare@trustingroup.in,
            web:www.trustingroup.in
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Footer;
