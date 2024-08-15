// @ts-nocheck
// Ignoring type check because stepper packages have type issue
"use client";
import { Stepper, Step } from "react-form-stepper";

const StatusStepper = ({ step }: { step: number }) => {
  return (
    <Stepper
      activeStep={step - 1}
      styleConfig={{
        activeBgColor: "#16a34a",
        completedBgColor: "#166534",
        activeColor: "#4ade80",
        completedColor: "#14532d",
      }}
    >
      <Step label="Registered" />
      {/* <Step label="Review Pending" /> */}
      <Step label="Under review and Sample requested (HOD)" />
      {/* <Step label="Requested" /> */}
      <Step label="Under Registration team (Sample issue)" />
      <Step label="Sample Received" />
      <Step label="Under Testing" />
      <Step label="Under QC Review" />
      <Step label="Under QA Review" />
      {/* <Step label="Under Report preparation" /> */}
      <Step label="Draft report/ Report released" />
      <Step label="Verfiy Sign" />
      {/* <Step label="Verification Pending" /> */}
      <Step label="Done" />
    </Stepper>
  );
};

export default StatusStepper;
