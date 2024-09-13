import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import {
    Data,
    SampleDetailSchema,
    SampleTestParameters,
  } from "@/app/dashboard/samples/[id]/typings";

const SampleDetails = ({
  data,
  fixed = false,
}: {
  data: Data;
  fixed?: boolean;
}) => (
  <View fixed>
    <View style={{ marginTop: 5, border: "1 solid #000", padding: 2 }}>
      <Text
        style={{
          textAlign: "center",
          fontWeight: "medium",
          textTransform: "uppercase",
        }}
      >
        Sample Details
      </Text>
    </View>

    <View
      style={{
        border: "1 solid #000",
        display: "flex",
        flexDirection: "row",
        fontWeight: "bold",
        padding: 2,
      }}
    >
      <Text
        style={{
          borderRight: "1 solid #000",
          width: 140,
          padding: 2,
          fontWeight: "medium",
        }}
      >
        Sample Name
      </Text>
      <Text
        style={{
          borderRight: "1 solid #000",
          width: 140,
          padding: 2,
          marginLeft: 4,
        }}
      >
        {data.sample.sample_name}
      </Text>

      <Text
        style={{
          borderRight: "1 solid #000",
          maxWidth: 100,
          padding: 2,
          fontWeight: "medium",
          display: "flex",
          flexWrap: "wrap",
          flexGrow: 1,
          flexBasis: 0,
        }}
      >
        Test Method / Specification
      </Text>
      <Text style={{ padding: 2, marginLeft: 4 }}>
        {data.sample.test_method ? data.sample.test_method : "N/A"}
      </Text>
    </View>
    <View
      style={{
        border: "1 solid #000",
        display: "flex",
        flexDirection: "row",
        fontWeight: "bold",
        padding: 2,
      }}
    >
      <Text
        style={{
          borderRight: "1 solid #000",
          width: 140,
          padding: 2,
          fontWeight: "medium",
        }}
      >
        Batch No.
      </Text>
      <Text
        style={{
          borderRight: "1 solid #000",
          width: 140,
          padding: 2,
          marginLeft: 4,
        }}
      >
        {data.sample.batch_or_lot_no}
      </Text>
      <Text
        style={{
          borderRight: "1 solid #000",
          width: 100,
          padding: 2,
          fontWeight: "medium",
        }}
      >
        Mfg Date
      </Text>
      <Text style={{ padding: 2, marginLeft: 4 }}>
        {data.sample.manufactured_date}
      </Text>
    </View>
    <View
      style={{
        border: "1 solid #000",
        display: "flex",
        flexDirection: "row",
        fontWeight: "bold",
        padding: 2,
      }}
    >
      <Text
        style={{
          borderRight: "1 solid #000",
          width: 140,
          padding: 2,
          fontWeight: "medium",
        }}
      >
        Batch Size
      </Text>
      <Text
        style={{
          padding: 2,
          borderRight: "1 solid #000",
          width: 140,
          marginLeft: 4,
        }}
      >
        {data.sample.batch_size}
      </Text>

      <Text
        style={{
          borderRight: "1 solid #000",
          width: 100,
          padding: 2,
          fontWeight: "medium",
        }}
      >
        Exp Date
      </Text>
      <Text style={{ padding: 2, marginLeft: 4 }}>
        {" "}
        {data.sample.expiry_date}
      </Text>
    </View>
    <View
      style={{
        border: "1 solid #000",
        display: "flex",
        flexDirection: "row",
        fontWeight: "bold",
        padding: 2,
      }}
    >
      <Text
        style={{
          borderRight: "1 solid #000",
          width: 140,
          padding: 2,
          fontWeight: "medium",
        }}
      >
        Manufactured by
      </Text>
      <Text
        style={{
          padding: 2,
          borderRight: "1 solid #000",
          width: 140,
          marginLeft: 4,
        }}
      >
        {data.sample.registration.manufactured_by ?? "N/A"}
      </Text>

      <Text
        style={{
          borderRight: "1 solid #000",
          width: 100,
          padding: 2,
          fontWeight: "medium",
        }}
      >
        Sampled By
      </Text>
      <Text style={{ padding: 2, marginLeft: 4 }}>
        {" "}
        {data.sample.registration.sampled_by}
      </Text>
    </View>
    <View
      style={{
        border: "1 solid #000",
        display: "flex",
        flexDirection: "row",
        fontWeight: "bold",
        padding: 2,
      }}
    >
      <Text
        style={{
          borderRight: "1 solid #000",
          width: 140,
          padding: 2,
          fontWeight: "medium",
        }}
      >
        Sample Description
      </Text>
      <Text style={{ padding: 2, width: "65%", marginLeft: 4 }}>
        {data.sample.description}
      </Text>
    </View>
    <View
      style={{
        border: "1 solid #000",
        display: "flex",
        flexDirection: "row",
        fontWeight: "bold",
        padding: 2,
      }}
    >
      <Text
        style={{
          borderRight: "1 solid #000",
          width: 140,
          padding: 2,
          fontWeight: "medium",
        }}
      >
        Quantity Received
      </Text>
      <Text style={{ padding: 2, marginLeft: 4 }}>
        {data.sample.received_quantity ?? "---"}
      </Text>
    </View>

    <View
      style={{
        border: "1 solid #000",
        display: "flex",
        flexDirection: "row",
        fontWeight: "bold",
        padding: 2,
      }}
    >
      <Text
        style={{
          borderRight: "1 solid #000",
          width: 140,
          padding: 2,
          fontWeight: "medium",
        }}
      >
        Additional details
      </Text>
      <Text style={{ padding: 2, marginLeft: 4 }}>
        {data?.sample?.additional_detail ?? "N/A"}
      </Text>
    </View>
  </View>
);

export default SampleDetails;