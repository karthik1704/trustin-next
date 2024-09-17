/* eslint-disable jsx-a11y/alt-text */
import { View, Text, Image } from "@react-pdf/renderer";
import { SampleDetailSchema } from "@/app/dashboard/samples/[id]/typings";
import { dateFormatter } from "@/lib/utils";
import React from "react";

const SIGN_IMAGES: { [key: string]: string } = {
  "24": "/images/signs/mahendren.png",
  "25": "/images/signs/senthil-kumar.png",
  "16": "/images/signs/vasantha.png",
  "14": "/images/signs/tamil vannan.png",
  "15": "/images/signs/sabari.png",
  "30": "/images/signs/dhanraj.png",
};

const AuthorizedSign = ({
  sample_detail,
  marginTop = 50,
  height = 50,
  qr,
}: {
  sample_detail: SampleDetailSchema[];
  marginTop?: number;
  height?: number;
  qr: string;
}) => (
  <View
    style={{ position: "absolute", bottom: 20, left: 0, right: 0, padding: 1 }}
  >
    <View
      style={{
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
      <View
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {sample_detail.map((detail, index) => (
          <React.Fragment key={detail.id}>
          <View
            key={detail.id}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
          >
            <Text
              style={{
                fontWeight: "medium",
                textAlign: "center",
                marginBottom: "2px",
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
                textAlign: "center",
                marginBottom: "2px",
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
                textAlign: "center",
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
                textAlign: "center",
                fontSize: "8px",
              }}
            >
              {detail.sign_verified && detail.authorized_sign
                ? `${detail.authorized_sign_date ? dateFormatter(detail.authorized_sign_date as string) : ""} `
                : ""}
            </Text>
          </View>
          {index ===0 && (
            <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              height: "100px",
            }}
          >
            <Image src={qr} style={{ width: "50px", height: "50px" }} />
          </View>
          )}
          {sample_detail.length ===1 && (
            <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
          >
          </View>
          )}
        </React.Fragment>
        ))}
        
      </View>
    </View>
  </View>
);

export default AuthorizedSign;
