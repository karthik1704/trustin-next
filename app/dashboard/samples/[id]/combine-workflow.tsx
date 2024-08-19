import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import StatusStepper from "./status-stepper1";
import {
  Data,
  SampleDetailSchema,
  SampleHistory,
  SampleTestParameters,
} from "./typings";
import WorkFlowForm from "@/components/WorkFlowForms/workflowform";
import UnderTestingForm from "./under-testing-form";
import { User } from "@/types/user";
import Select from "@/components/select-input";
import EmailPopup from "./email-popup";

type Props = {
  data: Data;
  formData: SampleDetailSchema | undefined;
  test_params: SampleTestParameters[];
  test_type_id: number;
  sample_history: SampleHistory;
  current_step: number;
  openModal: (type: string) => void;
  actionFn: (
    prevState: any,
    data: FormData,
  ) => Promise<
    { fieldErrors: null; type: string; message: string | undefined } | undefined
  >;
  actionFnResult: (
    data: any,
  ) => Promise<
    { fieldErrors: null; type: string; message: string | undefined } | undefined
  >;
  actionFnReject: (
    data: any,
  ) => Promise<
    { fieldErrors: null; type: string; message: string | undefined } | undefined
  >;
  formAction: (data: FormData) => void;
  signUsers: User[];
  qr: string;
};

const CombineWorkflow = ({
  data,
  formData,
  test_params,
  test_type_id,
  sample_history = [],
  current_step,
  openModal,
  actionFn,
  actionFnReject,
  actionFnResult,
  formAction,
  signUsers,
  qr,
}: Props) => {
  const getNextStatus = (nextStep: number) => {
    console.log(sample_history);
    if (!sample_history.length) return nextStep;

    const last_history = sample_history[0];
    if (
      last_history.from_status_id === 7 &&
      nextStep < last_history.from_status_id
    )
      return 7;

    return nextStep;
  };
  return (
    <div className="mb-3 w-full flex-col">
      <StatusStepper step={current_step} />
      {/* <p>{data?.sample?.status}</p> */}

      {data.sample.sample_history.at(0)?.comments && (
        <Alert
          variant={
            sample_history?.[0]?.from_status_id !== undefined
              ? sample_history[0].from_status_id > current_step
                ? "destructive"
                : "success"
              : "default"
          }
        >
          <AlertTitle>Comment!</AlertTitle>
          <AlertDescription className="pl-5 font-medium">
            - {sample_history.at(0)?.comments ?? "---"}
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-1 flex flex-col gap-9">
        {current_step === 1 && (
          <WorkFlowForm
            test_type_id={test_type_id}
            rejectActionData={actionFnReject}
            currentStep={current_step}
            actionData={formAction}
            assign={data?.sample?.assigned_to}
            status={data?.sample?.status != "Submitted" ? "Submitted" : ""}
            status_id={getNextStatus(2)}
            buttonName="Submit for Review"
          />
        )}
        {current_step === 2 && (
          <>
            {/* <WorkFlowForm
            showRejectButton={true}
            rejectActionData={actionFnReject}
            currentStep={data?.sample?.status_id}
            actionData={formAction}
            assign={data.sample.assigned_to}
            status_id={3}
            buttonName="Approve"
          /> */}
            <UnderTestingForm
              formData={formData}
              test_type_id={test_type_id}
              data={data}
              showRejectButton={true}
              rejectActionData={actionFnReject}
              currentStep={current_step}
              assigned_to={data.sample.assigned_to}
              parameters={test_params}
              assigneeData={data.users}
              patchFn={actionFnResult}
              step={getNextStatus(3)}
            />
          </>
        )}

        {current_step === 3 && (
          // <WorkFlowForm
          //   showRejectButton={true}
          //   rejectActionData={actionFnReject}
          //   currentStep={data?.sample?.status_id}
          //   actionData={formAction}
          //   assign={data.sample.assigned_to}
          //   status_id={getNextStatus(4)}
          //   buttonName="Sample Received"
          //   showComment={true}
          // />
          <UnderTestingForm
            formData={formData}
            test_type_id={test_type_id}
            data={data}
            showRejectButton={true}
            rejectActionData={actionFnReject}
            currentStep={current_step}
            assigned_to={data.sample.assigned_to}
            parameters={test_params}
            assigneeData={data.users}
            patchFn={actionFnResult}
            step={getNextStatus(4)}
          />
        )}

        {current_step === 4 && (
          // <WorkFlowForm
          //   showRejectButton={true}
          //   rejectActionData={actionFnReject}
          //   currentStep={data?.sample?.status_id}
          //   actionData={formAction}
          //   assign={data.sample.assigned_to}
          //   status_id={5}
          //   buttonName="Assign"
          //   showComment={true}
          // />
          <UnderTestingForm
            formData={formData}
            test_type_id={test_type_id}
            data={data}
            showRejectButton={true}
            rejectActionData={actionFnReject}
            currentStep={current_step}
            assigned_to={data.sample.assigned_to}
            parameters={test_params}
            patchFn={actionFnResult}
            step={getNextStatus(5)}
          />
        )}

        {current_step === 5 && (
          <UnderTestingForm
            formData={formData}
            test_type_id={test_type_id}
            data={data}
            showRejectButton={true}
            rejectActionData={actionFnReject}
            currentStep={current_step}
            assigned_to={data.sample.assigned_to}
            parameters={test_params}
            patchFn={actionFnResult}
            step={getNextStatus(6)}
          />
        )}
        {current_step === 6 && (
          <UnderTestingForm
            formData={formData}
            test_type_id={test_type_id}
            data={data}
            showRejectButton={true}
            rejectActionData={actionFnReject}
            currentStep={current_step}
            assigned_to={data.sample.assigned_to}
            parameters={test_params}
            patchFn={actionFnResult}
            step={getNextStatus(7)}
          />
        )}
        {current_step === 7 && (
          <UnderTestingForm
            formData={formData}
            test_type_id={test_type_id}
            data={data}
            showRejectButton={true}
            rejectActionData={actionFnReject}
            currentStep={current_step}
            assigned_to={data.sample.assigned_to}
            parameters={test_params}
            patchFn={actionFnResult}
            step={8}
            openModal={openModal}
          />
          // <WorkFlowForm
          //   rejectActionData={actionFnReject}
          //   currentStep={data?.sample?.status_id}
          //   actionData={formAction}
          //   assign={data?.sample?.assigned_to}
          //   status={
          //     data?.sample?.status != "Submitted" ? "Submitted" : ""
          //   }
          //   status_id={8}
          //   buttonName="Prepartion Complete"
          //   showRejectButton
          //   showComment
          // />
        )}
        {current_step === 8 && (
          <UnderTestingForm
            formData={formData}
            test_type_id={test_type_id}
            data={data}
            showRejectButton={true}
            rejectActionData={actionFnReject}
            currentStep={current_step}
            assigned_to={data.sample.assigned_to}
            parameters={test_params}
            patchFn={actionFnResult}
            step={9}
            openModal={openModal}
            signUsers={signUsers}
            qr={qr}
          />
        )}
        {current_step === 9 && (
          <UnderTestingForm
            formData={formData}
            test_type_id={test_type_id}
            data={data}
            showRejectButton={true}
            rejectActionData={actionFnReject}
            currentStep={current_step}
            assigned_to={data.sample.assigned_to}
            parameters={test_params}
            patchFn={actionFnResult}
            step={10}
            openModal={openModal}
            signUsers={signUsers}
            qr={qr}
          />
        )}
        {current_step === 10 && (
          <div className="mb-3 text-center">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <EmailPopup
                filename={data.sample.sample_id}
                data={data}
                qr={qr ? qr : ""}
                isDraft={false}
              />
              <button
                type="button"
                onClick={() => openModal && openModal("Original")}
                className="flex w-1/5 justify-center rounded bg-primary p-2 font-medium text-gray"
              >
                Print Original
              </button>

              <button
                type="button"
                onClick={() => openModal && openModal("Copy")}
                className="flex w-1/5 justify-center rounded bg-primary p-2 font-medium text-gray"
              >
                Print Copy
              </button>
              {/* <EmailPopup  filename={data.sample.sample_id} pdf={}/> */}
            </div>

            <h4 className="text-title-xl2 font-bold">
              Sample WorkFlow Completed
            </h4>
            {([1,2].includes(data.currentUser.department_id) || data.currentUser.role_id===9)  && (
              <WorkFlowForm
                test_type_id={test_type_id}
                rejectActionData={actionFnReject}
                currentStep={current_step}
                actionData={formAction}
                assign={data?.sample?.assigned_to}
                status={data?.sample?.status != "Submitted" ? "Submitted" : ""}
                status_id={9}
                buttonName="Go Back"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CombineWorkflow;
