/* eslint-disable jsx-a11y/alt-text */
import { View, Text, Image } from "@react-pdf/renderer";
import { SampleDetailSchema } from "@/app/dashboard/samples/[id]/typings";
import { dateFormatter } from "@/lib/utils";

const SIGN_IMAGES: { [key: string]: string } = {
    "24": "/images/signs/mahendren.png",
    "25": "/images/signs/senthil-kumar.png",
    "16": "/images/signs/vasantha.png",
    "14": "/images/signs/tamil vannan.png",
    "15": "/images/signs/sabari.png",
    "30": "/images/signs/dhanraj.png",
  };


const AuthorizedSignMail = ({
    sample_detail,
    marginTop = 100,
    height = 50,
    qr    
  }: {
    sample_detail: SampleDetailSchema[];
    marginTop?: number;
    height?: number;
    qr:string
  }) => (
    <View
      style={{
        padding: 1,
        marginTop: marginTop,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        flexDirection: "column",
        fontSize: 10,
        width: "100%",


      }}
      fixed
    >
    {/* <View style={{ height: "100px" }}>
    <Image src={qr} style={{ width: 50, height: 50 }} />
  </View> */}
      <View
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row-reverse",
          width: "100%",
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
                fontWeight: "medium",
                textAlign: "center", // Center text
                marginBottom: "8px",
              }}
            >
              Authorized Signatory
            </Text>
            {detail.sign_verified && detail.authorized_sign && (
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
                marginBottom: "4px",
                fontSize: "10px",
              }}
            >
              {detail.sign_verified && detail.authorized_sign
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
              {detail.sign_verified && detail.authorized_sign
                ? `${detail.authorized_sign.designation ?? ""} `
                : ""}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                textAlign: "center", // Center text
                fontSize: "8px",
              }}
            >
              {detail.sign_verified && detail.authorized_sign
                ? `${detail.authorized_sign_date ? dateFormatter(detail.authorized_sign_date as string) : ""} `
                : ""}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
            
export default AuthorizedSignMail;
