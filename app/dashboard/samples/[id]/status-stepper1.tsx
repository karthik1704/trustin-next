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
      <Step label="Draft" />
      <Step label="Review Pending" />
      <Step label="Requested" />
      <Step label="Received" />
      <Step label="Under Testing" />
      <Step label="Verification Pending" />
      <Step label="Done" />
    </Stepper>
  );
};

export default StatusStepper;
