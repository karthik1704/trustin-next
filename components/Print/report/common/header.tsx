/* eslint-disable jsx-a11y/alt-text */
import { logo } from "@/app/constant";
import { View, Text, Image } from "@react-pdf/renderer";

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
          <Image src={logo} style={{ width: 120, height: 80 }} />
        </View>
        <Text style={{textAlign:'right'}}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
            fixed
          />
      </View>
    );
  };

export default Header;
