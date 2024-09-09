import { View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 3,
    left: 0,
    right: 0,
    padding: 2,
  },
  text: {
    fontWeight: "medium",
    textAlign: "center",
    fontSize: 10,
    marginTop: 3,
  },
});

const Footer = () => (
  <View style={styles.footer} fixed>
    <Text
      style={[styles.text, { textAlign: "left", borderBottom: "1px solid #000", paddingHorizontal:0 }]}
    >
      PAN No.: AAFCT6714N
    </Text>

    <Text style={styles.text}>adding value by Trust</Text>
  </View>
);

export default Footer;
